const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { passport, hasGoogleOAuthConfig } = require('../config/passport');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const buildAuthResponse = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    token: generateToken(user._id)
});

const encodeOAuthState = (payload) => {
    return Buffer.from(JSON.stringify(payload)).toString('base64url');
};

const decodeOAuthState = (value) => {
    if (!value) return {};

    try {
        return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
    } catch (error) {
        return {};
    }
};

const getFrontendBaseUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

const buildFrontendRedirectUrl = (path, params) => {
    const url = new URL(path, getFrontendBaseUrl());
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, String(value));
        }
    });
    return url.toString();
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Only customer and seller roles are allowed via signup
        const allowedRoles = ['customer', 'seller'];
        const selectedRole = role || 'customer';
        if (!allowedRoles.includes(selectedRole)) {
            return res.status(403).json({ message: 'Admin accounts cannot be created via signup. Contact system administrator.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password, role: selectedRole });
        res.status(201).json(buildAuthResponse(user));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json(buildAuthResponse(user));
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    res.json(req.user);
};

exports.googleAuth = (req, res, next) => {
    if (!hasGoogleOAuthConfig()) {
        return res.status(500).json({ message: 'Google OAuth is not configured on the server' });
    }

    const requestedRole = req.query.role;
    const allowedRoles = ['customer', 'seller'];
    const role = allowedRoles.includes(requestedRole) ? requestedRole : 'customer';
    const intent = req.query.intent === 'signup' ? 'signup' : 'login';
    const state = encodeOAuthState({ role, intent });

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
        state
    })(req, res, next);
};

exports.googleAuthCallback = (req, res, next) => {
    if (!hasGoogleOAuthConfig()) {
        return res.redirect(buildFrontendRedirectUrl('/login', {
            error: 'Google OAuth is not configured on the server'
        }));
    }

    passport.authenticate('google', { session: false }, async (error, profile) => {
        if (error || !profile) {
            return res.redirect(buildFrontendRedirectUrl('/login', {
                error: 'Google authentication failed'
            }));
        }

        try {
            const oauthState = decodeOAuthState(req.query.state);
            const allowedRoles = ['customer', 'seller'];
            const selectedRole = allowedRoles.includes(oauthState.role) ? oauthState.role : 'customer';
            const email = profile.emails?.[0]?.value;

            if (!email) {
                return res.redirect(buildFrontendRedirectUrl('/login', {
                    error: 'Google account did not return an email address'
                }));
            }

            let user = await User.findOne({
                $or: [{ googleId: profile.id }, { email }]
            });

            if (!user) {
                user = await User.create({
                    name: profile.displayName || email.split('@')[0],
                    email,
                    googleId: profile.id,
                    avatar: profile.photos?.[0]?.value,
                    role: selectedRole
                });
            } else {
                user.googleId = user.googleId || profile.id;
                user.avatar = profile.photos?.[0]?.value || user.avatar;
                if (!user.role || user.role === 'admin') {
                    user.role = selectedRole;
                }
                await user.save();
            }

            const authPayload = buildAuthResponse(user);

            return res.redirect(buildFrontendRedirectUrl('/login', {
                token: authPayload.token,
                name: authPayload.name,
                email: authPayload.email,
                role: authPayload.role,
                avatar: authPayload.avatar,
                userId: authPayload._id
            }));
        } catch (callbackError) {
            return res.redirect(buildFrontendRedirectUrl('/login', {
                error: callbackError.message || 'Google authentication failed'
            }));
        }
    })(req, res, next);
};
