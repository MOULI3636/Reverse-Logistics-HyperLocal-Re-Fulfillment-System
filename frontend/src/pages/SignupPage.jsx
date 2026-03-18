import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const SignupPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState('customer');
    const [name, setName] = useState('');
    const googleAuthUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/google`;

    const handleSignup = (e) => {
        e.preventDefault();
        if (!name) return;

        // Mock generic signup -> auto login
        login({ name, role });

        // Redirect based on role
        if (role === 'admin') navigate('/admin');
        else if (role === 'seller') navigate('/seller');
        else navigate('/shop');
    };

    const handleGoogleSignup = () => {
        window.location.href = `${googleAuthUrl}?intent=signup&role=${encodeURIComponent(role)}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 pt-10 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                    <UserPlus className="w-8 h-8" />
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Create Account</h1>
                <p className="text-slate-500 mb-8">Join our logistics platform today.</p>

                <form onSubmit={handleSignup} className="space-y-6 text-left">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Jane Doe"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Account Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                        >
                            <option value="customer">Customer (Shop)</option>
                            <option value="seller">Seller (Manage Orders)</option>
                            <option value="admin">Admin (Oversee System)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 focus:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                        Create Account
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3 text-sm text-slate-400">
                    <div className="h-px flex-1 bg-slate-200"></div>
                    <span>or</span>
                    <div className="h-px flex-1 bg-slate-200"></div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="w-full py-3.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-sm border border-slate-200"
                >
                    <span className="text-lg font-extrabold text-blue-600">G</span>
                    Continue with Google
                </button>

                <p className="mt-8 text-sm text-slate-500">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
