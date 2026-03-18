import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, User, ChevronRight, Loader2 } from 'lucide-react';

const CustomerSetupPage = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || '');
    const [address, setAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Geocode the address
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address + ', India')}&format=json&limit=1`);
            const data = await res.json();

            if (!data || data.length === 0) {
                setError("Could not find this address. Please try adding more details.");
                setIsSubmitting(false);
                return;
            }

            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);

            // Update user context
            login({
                ...user,
                name,
                address,
                location: { lat, lng }
            });

            // Redirect to shop
            navigate('/shop');
        } catch (err) {
            console.error("Geocoding Error: ", err);
            setError("Network error occurred while verifying the address.");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 pt-10 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Delivery Details</h1>
                    <p className="text-slate-500 text-sm mt-2">Before we start shopping, where should we deliver your products?</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Location (City / Street)</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="e.g. Pune, Maharashtra"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 mt-4 bg-slate-900 hover:bg-emerald-600 focus:bg-emerald-600 disabled:opacity-75 disabled:cursor-not-allowed active:scale-[0.98] text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg border-none cursor-pointer"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Verifying Location...</>
                        ) : (
                            <>Start Shopping <ChevronRight className="w-5 h-5" /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CustomerSetupPage;
