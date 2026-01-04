import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Client } from '@stomp/stompjs';
import 'leaflet/dist/leaflet.css';
import api from '../../api/api';
// Fix Leaflet marker icon issue
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const TrackingPage = () => {
    const { id } = useParams();
    const [shipment, setShipment] = useState(null);
    const [position, setPosition] = useState(null); // [lat, lng]

    useEffect(() => {
        // Initial Fetch
        api.get(`/shipments/${id}/track`)
            .then(res => {
                setShipment(res.data);
                if (res.data.currentLatitude && res.data.currentLongitude) {
                    setPosition([res.data.currentLatitude, res.data.currentLongitude]);
                }
            })
            .catch(err => console.error(err));
    }, [id]);

    // WebSocket for Live Updates
    useEffect(() => {
        const client = new Client({
            brokerURL: 'ws://localhost:8085/ws/websocket',
            onConnect: () => {
                client.subscribe(`/topic/track/${id}`, message => {
                    const update = JSON.parse(message.body);
                    if (update.latitude && update.longitude) {
                        setPosition([update.latitude, update.longitude]);
                        // Update status if changed
                        if (update.status) {
                            setShipment(prev => ({ ...prev, status: update.status }));
                        }
                    }
                });
            }
        });
        client.activate();

        return () => client.deactivate();
    }, [id]);

    if (!shipment) return <div className="p-10 text-center">Loading Tracking Info...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-orange-600 p-6 text-white">
                    <h1 className="text-2xl font-bold">Tracking Shipment</h1>
                    <p className="opacity-90">Order #{shipment.orderId}</p>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-8">
                    <div>
                        <div className="mb-6">
                            <h2 className="text-gray-500 text-sm uppercase tracking-wide">Status</h2>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{shipment.status}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                EST Delivery: {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="prose">
                            <h3 className="text-lg font-semibold">Delivery Details</h3>
                            <ul className="list-none p-0 mt-2 space-y-2">
                                <li>
                                    <span className="font-medium text-gray-700">Agent:</span> {shipment.agentName || 'Assigning...'}
                                </li>
                                <li>
                                    <span className="font-medium text-gray-700">Phone:</span> {shipment.agentPhone || 'N/A'}
                                </li>
                                <li>
                                    <span className="font-medium text-gray-700">Shipping To:</span>
                                    <p className="text-gray-600 text-sm mt-1">{shipment.shippingAddress}</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="h-64 md:h-auto bg-gray-100 rounded-lg overflow-hidden relative">
                        {position ? (
                            <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={position}>
                                    <Popup>
                                        Current Location <br /> Agent is here.
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                Map data unavailable (Waiting for agent update)
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;
