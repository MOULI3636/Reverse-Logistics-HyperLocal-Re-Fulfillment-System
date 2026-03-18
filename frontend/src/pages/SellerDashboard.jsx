import { useState, useEffect } from 'react';
import { useOrders } from '../context/OrderContext';
import MapTracker from '../components/MapTracker';
import { Map, X } from 'lucide-react';

const useScrollAnimation = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('animate-visible');
                });
            },
            { threshold: 0.15 }
        );
        document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);
};

const SellerDashboard = () => {
    useScrollAnimation();
    const { orders, updateOrderStatus, approveReturn } = useOrders();
    const [notification, setNotification] = useState('');
    const [selectedMapOrder, setSelectedMapOrder] = useState(null);

    const handleAction = (id, newStatus, message) => {
        updateOrderStatus(id, newStatus);
        setNotification(message);
        setTimeout(() => setNotification(''), 4000);
    };

    const pendingCount = orders.filter(r => r.status === 'pending_seller_approval').length;
    const activeCount = orders.filter(r => r.status.includes('dispatched')).length;
    const handledCount = orders.length;

    return (
        <div className="min-h-screen pt-28 pb-24 px-6 bg-slate-50">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 fade-in">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
                        style={{ background: 'rgba(168,85,247,0.12)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>
                        🏪 Seller Panel
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
                        Orders <span style={{ color: '#66bb60' }}>Dashboard</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Review customer orders. Approve and dispatch from the smartest warehouse location.
                    </p>
                </div>

                {/* Notification */}
                {notification && (
                    <div className="p-4 mb-8 text-sm font-semibold animate-fade-in flex items-center justify-between rounded-xl"
                        style={{ backgroundColor: 'rgba(102,187,96,0.1)', border: '1px solid rgba(102,187,96,0.3)' }}>
                        <span style={{ color: '#66bb60' }}>{notification}</span>
                        <button onClick={() => setNotification('')} className="text-slate-500 hover:text-slate-900 bg-transparent border-none cursor-pointer text-lg">✕</button>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-12 fade-in">
                    <div className="p-6 rounded-2xl text-center bg-white shadow-sm border border-slate-200">
                        <div className="text-3xl font-black text-amber-500">{pendingCount}</div>
                        <div className="text-sm text-slate-500 mt-1 font-medium">Pending Approval</div>
                    </div>
                    <div className="p-6 rounded-2xl text-center bg-white shadow-sm border border-slate-200">
                        <div className="text-3xl font-black text-emerald-500">{activeCount}</div>
                        <div className="text-sm text-slate-500 mt-1 font-medium">Dispatched Items</div>
                    </div>
                    <div className="p-6 rounded-2xl text-center bg-white shadow-sm border border-slate-200">
                        <div className="text-3xl font-black text-slate-900">{handledCount}</div>
                        <div className="text-sm text-slate-500 mt-1 font-medium">Total Lifetime Orders</div>
                    </div>
                </div>

                {/* Order List */}
                <div className="space-y-6">
                    {orders.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                            <p className="text-slate-500 font-medium">No orders yet. Waiting for customers to place orders.</p>
                        </div>
                    )}

                    {orders.map((order, i) => (
                        <div key={order.id} className="p-8 rounded-3xl fade-in flex flex-col md:flex-row gap-8 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow" style={{ transitionDelay: `${i * 0.1}s` }}>

                            <img src={order.product.image} alt="Product" className="w-32 h-32 object-cover rounded-2xl bg-slate-100" />

                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-slate-900 font-bold text-xl mb-1">{order.product.name}</h3>
                                        <p className="text-slate-500 text-sm font-mono">{order.id} • {new Date(order.date).toLocaleString()}</p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${order.status === 'pending_seller_approval' ? 'bg-amber-100 text-amber-700' :
                                        order.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            order.status === 'return_requested' ? 'bg-orange-100 text-orange-700' :
                                                order.status === 'return_approved' ? 'bg-teal-100 text-teal-700' :
                                                    order.status === 'returned' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-emerald-100 text-emerald-700'
                                        }`}>
                                        {order.status.replace(/_/g, ' ').toUpperCase()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-xs text-slate-500">Customer</span>
                                        <p className="font-semibold text-sm mt-1 text-slate-800">{order.customerName}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-xs text-slate-500">Destination</span>
                                        <p className="font-semibold text-sm mt-1 text-slate-800 truncate" title={order.customerAddress}>{order.customerAddress}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                                        <span className="text-xs text-amber-700">Source Warehouse</span>
                                        <p className="font-semibold text-sm mt-1 text-amber-900">
                                            {order.product.sourceWarehouse.name}
                                            <span className="text-xs text-amber-600/70 block">{order.distances.sourceDist.toFixed(1)} km away</span>
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                                        <span className="text-xs text-blue-700">Local Warehouse (Returned)</span>
                                        <p className="font-semibold text-sm mt-1 text-blue-900">
                                            {order.product.localWarehouse ? order.product.localWarehouse.name : 'N/A'}
                                            {order.product.localWarehouse && <span className="text-xs text-blue-600/70 block">{order.distances.localDist.toFixed(1)} km away</span>}
                                        </p>
                                    </div>
                                </div>

                                {order.status === 'pending_seller_approval' && (
                                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => handleAction(order.id, 'dispatched_source', `✅ Dispatched from Source (${order.product.sourceWarehouse.name})`)}
                                            className="px-6 py-3 rounded-xl font-bold text-sm bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all border border-amber-200"
                                        >
                                            📦 Dispatch Source ({order.distances.sourceDist.toFixed(0)}km)
                                        </button>

                                        {order.product.localWarehouse && (
                                            <button
                                                onClick={() => handleAction(order.id, 'dispatched_local', `✅ Dispatched from Local Storage (${order.product.localWarehouse.name})`)}
                                                className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all border border-emerald-200 relative"
                                            >
                                                ♻️ Dispatch Local ({order.distances.localDist.toFixed(0)}km)
                                                {order.distances.localDist < order.distances.sourceDist && <span className="absolute -top-3 -right-3 text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full z-10 shadow-sm">BEST</span>}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setSelectedMapOrder(order)}
                                            className="px-6 py-3 rounded-xl font-bold text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all border border-indigo-200 flex items-center gap-2"
                                        >
                                            <Map className="w-4 h-4" /> View Map Routing
                                        </button>

                                        <button
                                            onClick={() => handleAction(order.id, 'rejected', `❌ Order ${order.id} rejected.`)}
                                            className="px-6 py-3 ml-auto rounded-xl font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-200"
                                        >
                                            ✕ Reject Order
                                        </button>
                                    </div>
                                )}

                                {order.status === 'return_requested' && (
                                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await approveReturn(order.id);
                                                    setNotification(`✅ Return Approved and Marked for Admin.`);
                                                    setTimeout(() => setNotification(''), 4000);
                                                } catch (error) {
                                                    alert('Failed to approve return. Check console.');
                                                }
                                            }}
                                            className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all border border-emerald-200"
                                        >
                                            ✅ Approve Return
                                        </button>
                                    </div>
                                )}

                                {order.status !== 'pending_seller_approval' && order.status !== 'return_requested' && (
                                    <div className="flex justify-end pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => setSelectedMapOrder(order)}
                                            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all border border-indigo-200 flex items-center gap-2"
                                        >
                                            <Map className="w-4 h-4" /> View Map Routing
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedMapOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedMapOrder(null)} />
                    <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 pt-12">
                        <button
                            onClick={() => setSelectedMapOrder(null)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors bg-transparent border-none cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6 border-b border-slate-100 pb-6">
                            <h4 className="text-slate-900 font-bold text-xl flex items-center gap-2">🗺️ Logistics Routing Map</h4>
                            <p className="text-slate-500 text-sm mt-1">Comparing source vs local warehouse routing for order <strong className="text-indigo-600 font-mono">{selectedMapOrder.id}</strong></p>
                        </div>

                        {selectedMapOrder.customerLocation || selectedMapOrder.customerCoordinates ? (
                            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                                <MapTracker
                                    userLocation={selectedMapOrder.customerLocation || selectedMapOrder.customerCoordinates}
                                    sourceWarehouse={selectedMapOrder.product.sourceWarehouse}
                                    nearestWarehouse={selectedMapOrder.product.localWarehouse && selectedMapOrder.distances.localDist < selectedMapOrder.distances.sourceDist ? selectedMapOrder.product.localWarehouse : null}
                                    sourceDistance={selectedMapOrder.distances.sourceDist.toFixed(1)}
                                    nearestDistance={selectedMapOrder.product.localWarehouse && selectedMapOrder.distances.localDist < selectedMapOrder.distances.sourceDist ? selectedMapOrder.distances.localDist.toFixed(1) : null}
                                    distanceSaved={selectedMapOrder.product.localWarehouse && selectedMapOrder.distances.localDist < selectedMapOrder.distances.sourceDist ? (selectedMapOrder.distances.sourceDist - selectedMapOrder.distances.localDist).toFixed(1) : 0}
                                />
                            </div>
                        ) : (
                            <div className="py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                                <p className="text-slate-500 font-medium">Map coordinates not available for this older order.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;
