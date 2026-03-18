const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const hasGoogleOAuthConfig = () => {
    return Boolean(
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.GOOGLE_CALLBACK_URL
    );
};

if (hasGoogleOAuthConfig()) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL
            },
            (accessToken, refreshToken, profile, done) => {
                done(null, profile);
            }
        )
    );
}

module.exports = { passport, hasGoogleOAuthConfig };
