import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogIn } from 'lucide-react';
import API from '../api/axios';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const googleAuthUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/google`;
    const redirectUser = (userData) => {
        const nextUser = { ...userData };

        if (nextUser.role === 'customer' && !nextUser.location) {
            nextUser.location = { lat: 21.1458, lng: 79.0882 };
        }

        login(nextUser);

        if (nextUser.role === 'admin') navigate('/admin', { replace: true });
        else if (nextUser.role === 'seller') navigate('/seller', { replace: true });
        else navigate('/shop', { replace: true });
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const oauthError = params.get('error');

        if (oauthError) {
            setError(oauthError);
            return;
        }

        if (!token) return;

        redirectUser({
            _id: params.get('userId'),
            name: params.get('name'),
            email: params.get('email'),
            role: params.get('role'),
            avatar: params.get('avatar'),
            token
        });
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const { data } = await API.post('/auth/login', { email, password });
            redirectUser(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${googleAuthUrl}?intent=login`;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 pt-10 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                    <User className="w-8 h-8" />
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
                <p className="text-slate-500 mb-8">Sign in to your account to continue.</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold text-left">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6 text-left">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="customer@gmail.com"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                    </div>

                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-800">
                        <p className="font-semibold mb-1">Demo Credentials:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Customer: customer@gmail.com / customer@98765</li>
                            <li>Seller: seller@gmail.com / seller@98765</li>
                            <li>Admin: admin@gmail.com / admin@98765</li>
                        </ul>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-slate-900 hover:bg-emerald-600 focus:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                        <LogIn className="w-5 h-5" /> Sign In
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3 text-sm text-slate-400">
                    <div className="h-px flex-1 bg-slate-200"></div>
                    <span>or</span>
                    <div className="h-px flex-1 bg-slate-200"></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-3.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-sm border border-slate-200"
                >
                    <span className="text-lg font-extrabold text-blue-600">G</span>
                    Continue with Google
                </button>

                <p className="mt-8 text-sm text-slate-500">
                    Don't have an account? <Link to="/signup" className="text-emerald-600 font-bold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
