import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons for different entities
const customerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const sourceIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const nearestIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle auto-zooming to fit all markers
const FitBounds = ({ userPos, sourcePos, nearestPos }) => {
    const map = useMap();
    useEffect(() => {
        const bounds = L.latLngBounds([]);
        if (userPos) bounds.extend(userPos);
        if (sourcePos) bounds.extend(sourcePos);
        if (nearestPos) bounds.extend(nearestPos);

        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
    }, [map, userPos, sourcePos, nearestPos]);
    return null;
};

const MapTracker = ({
    userLocation,
    sourceWarehouse,
    nearestWarehouse,
    sourceDistance = 0,
    nearestDistance = 0,
    distanceSaved = 0
}) => {
    const [userPos, setUserPos] = useState(null);
    const [sourcePos, setSourcePos] = useState(null);
    const [nearestPos, setNearestPos] = useState(null);

    useEffect(() => {
        if (userLocation?.lat && userLocation?.lng) {
            setUserPos([userLocation.lat, userLocation.lng]);
        }
        if (sourceWarehouse?.lat && sourceWarehouse?.lng) {
            setSourcePos([sourceWarehouse.lat, sourceWarehouse.lng]);
        }
        if (nearestWarehouse?.lat && nearestWarehouse?.lng) {
            setNearestPos([nearestWarehouse.lat, nearestWarehouse.lng]);
        }
    }, [userLocation, sourceWarehouse, nearestWarehouse]);

    // Set a default center if nothing is provided (e.g., center of India)
    const defaultCenter = [20.5937, 78.9629];

    return (
        <div className="w-full h-96 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative mb-6">
            <MapContainer
                center={userPos || defaultCenter}
                zoom={userPos ? 12 : 5}
                className="w-full h-full"
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitBounds userPos={userPos} sourcePos={sourcePos} nearestPos={nearestPos} />

                {/* Customer Location */}
                {userPos && (
                    <Marker position={userPos} icon={customerIcon}>
                        <Popup>
                            <strong>Customer Location</strong>
                        </Popup>
                    </Marker>
                )}

                {/* Source Warehouse Location */}
                {sourcePos && (
                    <Marker position={sourcePos} icon={sourceIcon}>
                        <Popup>
                            <strong>Source Warehouse</strong><br />
                            {sourceWarehouse.name && <span>{sourceWarehouse.name}<br /></span>}
                            {sourceDistance && <span className="text-amber-600 font-medium">Original Route: {sourceDistance}km</span>}
                        </Popup>
                    </Marker>
                )}

                {/* Nearest Assigned Warehouse Location */}
                {nearestPos && (
                    <Marker position={nearestPos} icon={nearestIcon}>
                        <Popup>
                            <strong>Assigned Nearest Warehouse</strong><br />
                            {nearestWarehouse.name && <span>{nearestWarehouse.name}<br /></span>}
                            {nearestDistance && <span className="text-emerald-600 font-medium">New Route: {nearestDistance}km</span>}
                        </Popup>
                    </Marker>
                )}

                {/* Original Route Line (Red/Dashed) */}
                {userPos && sourcePos && (
                    <Polyline
                        positions={[userPos, sourcePos]}
                        color="#ef4444"
                        dashArray="5, 10"
                        weight={3}
                        opacity={0.6}
                    />
                )}

                {/* Optimized Route Line (Green/Solid) */}
                {userPos && nearestPos && (
                    <Polyline
                        positions={[userPos, nearestPos]}
                        color="#10b981"
                        weight={4}
                        opacity={0.9}
                    />
                )}
            </MapContainer>

            {/* Metrics Overlay Card */}
            <div className={`absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border max-w-xs ${Number(distanceSaved) > 0 ? 'border-emerald-100' : 'border-slate-200'}`}>
                <h4 className="font-bold text-slate-800 text-sm mb-2">Logistics Optimization</h4>
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Source Distance:</span>
                        <span className="font-medium">{sourceDistance} km</span>
                    </div>
                    <div className={`flex justify-between gap-4 ${nearestDistance ? 'text-emerald-700' : 'text-slate-700'}`}>
                        <span className="font-medium">Assigned Route:</span>
                        <span className="font-bold">{nearestDistance || sourceDistance} km</span>
                    </div>
                    <div className={`border-t border-slate-100 my-1 pt-1 flex justify-between gap-4 font-bold ${Number(distanceSaved) > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                        <span>Carbon & Distance Saved:</span>
                        <span>{distanceSaved || 0} km</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapTracker;
