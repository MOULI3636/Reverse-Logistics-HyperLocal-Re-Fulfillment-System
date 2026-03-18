import React, { useState } from 'react';
import { ShoppingBag, MapPin, Truck, ChevronRight, CheckCircle2, X, Loader2, User, Package, Clock, ShieldCheck, CalendarClock, Zap, XCircle } from 'lucide-react';
import { products, calculateDistance } from '../data/data';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import MapTracker from '../components/MapTracker';

const ShoppingPage = () => {
    const { user } = useAuth();
    const { placeOrder, orders, updateOrderStatus, requestReturn } = useOrders();
    const navigate = useNavigate();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [customerAddress, setCustomerAddress] = useState("");

    const myOrders = user ? orders.filter(o => o.customerName === user.name) : [];
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [geoError, setGeoError] = useState("");
    const [orderResult, setOrderResult] = useState(null);

    const handleOrderClick = (product) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setSelectedProduct(product);
        setOrderResult(null);
        setCustomerAddress(user?.address || "");
        setGeoError("");
        setIsModalOpen(true);
    };

    const getEstimatedDelivery = (distance) => {
        let days = 5; // Default for > 500km
        if (distance < 50) {
            days = 1;
        } else if (distance < 500) {
            days = 3;
        }

        return {
            days,
            timeString: `${days} Day${days > 1 ? 's' : ''}`
        };
    };

    const processOrder = async (e) => {
        e.preventDefault();
        if (!customerAddress) return;

        setIsGeocoding(true);
        setGeoError("");

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(customerAddress + ', India')}&format=json&limit=1`);
            const data = await res.json();

            if (!data || data.length === 0) {
                setGeoError("Could not find this address. Please try making it more specific.");
                setIsGeocoding(false);
                return;
            }

            const customerLat = parseFloat(data[0].lat);
            const customerLng = parseFloat(data[0].lon);

            const sourceDist = calculateDistance(
                customerLat, customerLng,
                selectedProduct.sourceWarehouse.lat, selectedProduct.sourceWarehouse.lng
            );

            let localDist = null;
            let dispatchFrom = "Source Warehouse";
            let finalDist = sourceDist;

            if (selectedProduct.localWarehouse) {
                localDist = calculateDistance(
                    customerLat, customerLng,
                    selectedProduct.localWarehouse.lat, selectedProduct.localWarehouse.lng
                );

                if (localDist < sourceDist) {
                    dispatchFrom = "Local Warehouse (Returned Stock)";
                    finalDist = localDist;
                }
            }

            // Save actual order to context
            const orderConfig = {
                product: selectedProduct,
                customerName: user.name,
                customerAddress,
                customerCoordinates: { lat: customerLat, lng: customerLng },
                distances: { sourceDist, localDist },
                calculatedDispatch: dispatchFrom
            };

            placeOrder(orderConfig);

            setOrderResult({
                addressDisplay: data[0].display_name,
                sourceDist,
                localDist,
                dispatchFrom,
                finalDist,
                customerLat,
                customerLng,
                estDelivery: getEstimatedDelivery(finalDist),
                originalDelivery: getEstimatedDelivery(sourceDist)
            });

        } catch (error) {
            console.error("Geocoding Error: ", error);
            setGeoError("Network error occurred while verifying the address.");
        }

        setIsGeocoding(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-5 md:px-10">

                <div className="mb-12 relative flex flex-col items-center">
                    {user && (
                        <div className="w-full flex justify-end mb-4 absolute top-0 lg:-top-6 right-0">
                            <button onClick={() => setIsAccountOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md rounded-xl font-semibold text-slate-700 shadow-sm transition-all cursor-pointer">
                                <User className="w-5 h-5" /> My Orders ({myOrders.length})
                            </button>
                        </div>
                    )}
                    <div className="text-center max-w-2xl mx-auto mt-14 sm:mt-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Discover <span className="text-emerald-600">Smart Logistics</span>
                        </h1>
                        <p className="text-lg text-slate-600">
                            A seamless shopping experience. We dispatch from the closest warehouse holding your item for lightning fast delivery.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col group">
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-5 bg-slate-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                {product.localWarehouse && (
                                    <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                        <Zap className="w-3 h-3" /> Faster Delivery!
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col flex-grow">
                                <span className="text-xs font-semibold text-emerald-600 mb-1 tracking-wider uppercase">{product.category}</span>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{product.name}</h3>
                                <div className="text-xl font-extrabold text-slate-900 mb-4 mt-auto">₹{product.price.toLocaleString('en-IN')}</div>

                                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                                    Premium quality {product.category.toLowerCase()} securely dispatched for lightning fast delivery. Complete checkout to confirm.
                                </p>
                                <div className="flex mt-auto mb-6 text-[13px] font-medium bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                                    {user && user.location ? (
                                        (() => {
                                            const sd = calculateDistance(user.location.lat, user.location.lng, product.sourceWarehouse.lat, product.sourceWarehouse.lng);
                                            const ld = product.localWarehouse ? calculateDistance(user.location.lat, user.location.lng, product.localWarehouse.lat, product.localWarehouse.lng) : Infinity;
                                            const isFasterOption = ld !== Infinity && ld < sd;
                                            const best = Math.min(sd, ld);
                                            return (
                                                <div className={`flex items-center gap-1.5 font-bold ${isFasterOption ? 'text-emerald-600' : 'text-slate-600'}`}>
                                                    <CalendarClock className={`w-4 h-4 ${isFasterOption ? 'text-emerald-500' : 'text-slate-400'}`} />
                                                    <span>Estimated Delivery Time: {getEstimatedDelivery(best).timeString}</span>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <CalendarClock className="w-4 h-4" />
                                            <span>Login to see delivery estimate</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleOrderClick(product)}
                                    className="w-full py-3 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
                                >
                                    <ShoppingBag className="w-4 h-4" /> Order Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className={`relative w-full ${orderResult ? 'max-w-4xl' : 'max-w-lg'} bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-all`}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10 bg-white/50 backdrop-blur-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {orderResult ? (
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="w-full md:w-5/12 bg-slate-50 p-8 border-r border-slate-100 flex flex-col justify-center items-center text-center">
                                    <div className="relative aspect-square w-48 h-48 rounded-2xl overflow-hidden mb-6 shadow-md border border-slate-200">
                                        <img src={selectedProduct.image} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{selectedProduct.name}</h3>
                                    <p className="text-lg text-emerald-600 font-bold">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Order Confirmed!</h2>
                                    <p className="text-slate-600 text-[15px] mb-8 leading-relaxed">
                                        Your order has been successfully placed and is pending seller confirmation. Great news – this item is eligible for <span className="font-bold text-emerald-600">Faster Delivery!</span>
                                    </p>

                                    <div className="bg-emerald-50 rounded-2xl p-5 mb-8 border border-emerald-100 flex items-start gap-3">
                                        <Zap className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-emerald-900 mb-1">Estimated Delivery Time: {orderResult.estDelivery.timeString}</p>
                                            <p className="text-xs text-emerald-700">
                                                {orderResult.localDist !== null && orderResult.localDist < orderResult.sourceDist
                                                    ? `Delivering in just ${orderResult.estDelivery.days} day(s)! (Previously ${orderResult.originalDelivery.days} days)`
                                                    : `Delivering in ${orderResult.estDelivery.days} day(s).`
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                                        <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm cursor-pointer border-none">
                                            Continue Shopping
                                        </button>
                                        <button onClick={() => { setIsModalOpen(false); setIsAccountOpen(true); }} className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all text-sm cursor-pointer border-none">
                                            Track Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Checkout Details</h2>
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{selectedProduct.name}</h3>
                                        <p className="text-emerald-600 font-bold">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>

                                <form onSubmit={processOrder} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Street Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                            <textarea
                                                required
                                                rows={3}
                                                value={customerAddress}
                                                onChange={(e) => setCustomerAddress(e.target.value)}
                                                placeholder="e.g. 150 MG Road, Brigade Area, Bangalore"
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none outline-none"
                                            />
                                        </div>
                                    </div>

                                    {geoError && (
                                        <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                                            {geoError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isGeocoding}
                                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-75 disabled:cursor-not-allowed active:scale-[0.98] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 border-none cursor-pointer"
                                    >
                                        {isGeocoding ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Verifying Address...</>
                                        ) : (
                                            <>Place Order <ChevronRight className="w-5 h-5" /></>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isAccountOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAccountOpen(false)} />
                    <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">My Orders</h2>
                                <p className="text-sm text-slate-500 font-medium">Order history and tracking details</p>
                            </div>
                            <button
                                onClick={() => setIsAccountOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors bg-transparent border-none cursor-pointer"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto bg-slate-50 h-full">
                            {myOrders.length === 0 ? (
                                <div className="text-center py-12 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-4"><Package size={32} /></div>
                                    <p className="text-lg font-bold text-slate-600">No orders yet</p>
                                    <p className="text-slate-400 text-sm">When you place orders, they will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {myOrders.map(order => (
                                        <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md tracking-wider">
                                                            {order.id}
                                                        </span>
                                                        <span className="text-xs font-medium text-slate-400">
                                                            {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <img src={order.product.image} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                                                        <h4 className="font-bold text-slate-900">{order.product.name}</h4>
                                                    </div>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <p className="font-bold text-emerald-600 text-lg">₹{order.product.price.toLocaleString('en-IN')}</p>

                                                    {order.status !== 'rejected' && order.status !== 'return_requested' && order.status !== 'returned' && (
                                                        <div className="flex items-center gap-1.5 justify-start sm:justify-end mt-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg w-max sm:ms-auto">
                                                            <CalendarClock className="w-4 h-4 text-emerald-500" />
                                                            Est. Delivery: {getEstimatedDelivery(order.distances.localDist && order.distances.localDist < order.distances.sourceDist ? order.distances.localDist : order.distances.sourceDist).timeString}
                                                        </div>
                                                    )}
                                                    {order.status === 'delivered' && (
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    await requestReturn(order.id);
                                                                } catch (error) {
                                                                    const backendMsg = error.response?.data?.message || error.message;
                                                                    alert(`Failed to request return.\\nReason: ${backendMsg}`);
                                                                    console.error(error);
                                                                }
                                                            }}
                                                            className="mt-3 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-bold rounded-lg transition-colors border border-red-200"
                                                        >
                                                            Return Item
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
                                                {order.status === 'pending_seller_approval' && <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />}
                                                {order.status === 'dispatched' && <Truck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}
                                                {order.status === 'accepted' && <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
                                                {order.status === 'delivered' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
                                                {order.status === 'return_requested' && <Clock className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />}
                                                {order.status === 'returned' && <Package className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />}
                                                {order.status === 'rejected' && <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}

                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-800 capitalize mb-1">
                                                        {order.status.replace(/_/g, ' ')}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        Delivery Address: <span className="font-medium text-slate-700">{order.customerAddress}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function RefreshCwIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
        </svg>
    );
}

export default ShoppingPage;
