import { useState, useEffect } from 'react';
import { useOrders } from '../context/OrderContext';
import { Truck, MapPin, CheckCircle, PackageCheck, AlertCircle, Map, X } from 'lucide-react';
import MapTracker from '../components/MapTracker';

const AdminDashboard = () => {
    const { orders, updateOrderStatus, deleteOrder } = useOrders();
    const [filter, setFilter] = useState('all');
    const [selectedMapOrder, setSelectedMapOrder] = useState(null);

    const handleStateChange = (id, currentStatus) => {
        let newStatus = currentStatus;
        if (currentStatus.includes('dispatched')) newStatus = 'out_for_delivery';
        else if (currentStatus === 'out_for_delivery') newStatus = 'delivered';
        else if (currentStatus === 'delivered') newStatus = 'return_requested';
        else if (currentStatus === 'return_approved') newStatus = 'returned';

        if (newStatus !== currentStatus) {
            updateOrderStatus(id, newStatus);
        }
    };

    const StatusBadge = ({ status }) => {
        const config = {
            'pending_seller_approval': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Seller' },
            'dispatched_source': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Dispatched (Source)' },
            'dispatched_local': { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Dispatched (Local)' },
            'out_for_delivery': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Out for Delivery' },
            'delivered': { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
            'return_requested': { bg: 'bg-red-100', text: 'text-red-800', label: 'Return Initiated' },
            'return_approved': { bg: 'bg-teal-100', text: 'text-teal-800', label: 'Return Approved by Seller' },
            'returned': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Returned to Warehouse' },
            'rejected': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Rejected' },
        };
        const st = config[status] || { bg: 'bg-slate-100', text: 'text-slate-800', label: status };
        return <span className={`px-3 py-1 rounded-full text-xs font-bold ${st.bg} ${st.text}`}>{st.label}</span>;
    };

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter || (filter === 'dispatched' && o.status.includes('dispatched')));

    return (
        <div className="min-h-screen pt-28 pb-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">System <span className="text-indigo-600">Admin</span></h1>
                        <p className="text-slate-500">Monitor all orders, logistics routes, and override package states.</p>
                    </div>

                    <div className="flex gap-2">
                        {['all', 'dispatched', 'out_for_delivery', 'delivered', 'return_requested', 'return_approved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                            >
                                {f.replace(/_/g, ' ').toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 font-bold text-slate-600 text-sm">Order ID</th>
                                <th className="p-4 font-bold text-slate-600 text-sm">Customer & Item</th>
                                <th className="p-4 font-bold text-slate-600 text-sm">Fulfillment Path</th>
                                <th className="p-4 font-bold text-slate-600 text-sm">Current State</th>
                                <th className="p-4 font-bold text-slate-600 text-sm">Admin Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No orders found for this filter.</td>
                                </tr>
                            )}
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-mono text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block">{order.id}</div>
                                        <div className="text-xs text-slate-400 mt-2">{new Date(order.date).toLocaleDateString()}</div>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex items-start gap-4">
                                            <img src={order.product.image} className="w-16 h-16 rounded-xl object-cover bg-slate-100" alt={order.product.name} />
                                            <div>
                                                <div className="font-bold text-slate-900">{order.customerName}</div>
                                                <div className="text-sm text-indigo-600 truncate max-w-[200px]">{order.product.name}</div>
                                                <div className="text-xs text-slate-500 mt-1 truncate max-w-[200px]" title={order.customerAddress}>📍 {order.customerAddress}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="text-sm border l-2 border-indigo-200 pl-3 py-1 space-y-2">
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                                Source: {order.product.sourceWarehouse.name} <span className="text-xs text-slate-400">({order.distances.sourceDist.toFixed(0)}km)</span>
                                            </div>
                                            {order.product.localWarehouse && (
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                                    Local: {order.product.localWarehouse.name} <span className="text-xs text-slate-400">({order.distances.localDist.toFixed(0)}km)</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 cursor-pointer text-indigo-600 hover:text-indigo-800 transition" onClick={() => setSelectedMapOrder(order)}>
                                                <Map className="w-4 h-4" />
                                                <span className="font-bold text-sm">View Routing Map</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <StatusBadge status={order.status} />
                                    </td>

                                    <td className="p-4 flex flex-col gap-2 relative">
                                        {['pending_seller_approval', 'rejected', 'returned', 'return_requested', 'delivered'].includes(order.status) ? (
                                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">No standard actions</span>
                                        ) : (
                                            <button
                                                onClick={() => handleStateChange(order.id, order.status)}
                                                className="px-4 py-2 w-max bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2"
                                            >
                                                {order.status.includes('dispatched') && <><Truck className="w-4 h-4" /> Set Out for Delivery</>}
                                                {order.status === 'out_for_delivery' && <><PackageCheck className="w-4 h-4" /> Set Delivered</>}
                                                {order.status === 'return_approved' && <><CheckCircle className="w-4 h-4" /> Mark Received</>}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to completely cancel and delete Order ${order.id}?`)) {
                                                    deleteOrder(order.id);
                                                }
                                            }}
                                            className="px-4 py-2 w-max bg-red-100/50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 border border-red-200"
                                        >
                                            <X className="w-4 h-4" /> Cancel & Delete Order
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                            <h4 className="text-slate-900 font-bold text-xl flex items-center gap-2">🗺️ Admin Logistics View</h4>
                            <p className="text-slate-500 text-sm mt-1">Reviewing routing paths for order <strong className="text-indigo-600 font-mono">{selectedMapOrder.id}</strong></p>
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
                            <div className="py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
                                <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
                                <p className="text-slate-500 font-medium">Coordinate data not available for this legacy order.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
