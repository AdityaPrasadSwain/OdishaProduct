import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api'; // Assuming standard axios instance
import { MapPin, Truck, CheckCircle, Package, ChevronRight } from 'lucide-react';
import { Client } from '@stomp/stompjs';
import AgentEarnings from './components/AgentEarnings';
import AgentShipmentModal from './components/AgentShipmentModal';

const AgentDashboard = () => {
    const { user } = useAuth();
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(() => {
        return localStorage.getItem('isAgentOnline') === 'true';
    });
    const [stompClient, setStompClient] = useState(null);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [viewMode, setViewMode] = useState('deliveries'); // 'deliveries' | 'earnings'

    // Fetch assigned shipments
    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const response = await api.get(`/agent/shipments/${user.id}`);
                setShipments(response.data);
            } catch (error) {
                console.error("Failed to fetch shipments", error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchShipments();
    }, [user]);

    // Persist Online Status
    useEffect(() => {
        localStorage.setItem('isAgentOnline', isOnline);
    }, [isOnline]);

    // WebSocket Connection for Location Simulation
    useEffect(() => {
        if (isOnline) {
            const client = new Client({
                brokerURL: 'ws://localhost:8085/ws/websocket',
                reconnectDelay: 5000,
                onConnect: () => {
                    console.log('Connected to WS');
                },
            });
            client.activate();
            setStompClient(client);

            // Simulate GPS updates every 5 seconds for active shipments
            const interval = setInterval(() => {
                shipments.forEach(s => {
                    if (s.status === 'OUT_FOR_DELIVERY') {
                        // Simulating slight movement
                        const lat = 20.2961 + (Math.random() - 0.5) * 0.01;
                        const lng = 85.8245 + (Math.random() - 0.5) * 0.01;

                        // ALSO RECORD EARNING (Simulated Distance for Demo)
                        // In real world, this happens on delivery completion

                        client.publish({
                            destination: `/app/track/${s.id}`,
                            body: JSON.stringify({
                                latitude: lat,
                                longitude: lng,
                                status: 'OUT_FOR_DELIVERY'
                            })
                        });
                    }
                });
            }, 5000);

            return () => {
                clearInterval(interval);
                client.deactivate();
            };
        }
    }, [isOnline, shipments]);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/agent/shipments/${id}/status?status=${status}`);
            setShipments(prev => prev.map(s => s.id === id ? { ...s, status } : s));

            // If Delivered, Record Earning (Simulated 5km)
            if (status === 'DELIVERED') {
                api.post(`/logistics/shipments/${id}/earning`, { distanceKm: 5.5 });
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Delivery Agent Dashboard</h1>
                    <p className="text-gray-500">Manage your deliveries and earnings</p>
                </div>
                <button
                    onClick={() => setIsOnline(!isOnline)}
                    className={`px-4 py-2 rounded font-bold transition-all ${isOnline ? 'bg-green-500 text-white shadow-lg ring-2 ring-green-300' : 'bg-gray-300'}`}
                >
                    {isOnline ? 'ONLINE (Sending Updates)' : 'GO ONLINE'}
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-6 border-b">
                <button
                    onClick={() => setViewMode('deliveries')}
                    className={`pb-2 px-4 font-medium transition-colors ${viewMode === 'deliveries' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                    My Deliveries
                </button>
                <button
                    onClick={() => setViewMode('earnings')}
                    className={`pb-2 px-4 font-medium transition-colors ${viewMode === 'earnings' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
                >
                    Earnings
                </button>
            </div>

            {viewMode === 'earnings' ? (
                <AgentEarnings />
            ) : (
                <div className="grid gap-4">
                    {shipments.map(shipment => (
                        <div key={shipment.id} className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-shadow flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg">Order #{shipment.orderId.substring(0, 8)}</h3>
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                                        {shipment.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{shipment.shippingAddress}</p>

                                <button
                                    onClick={() => setSelectedShipment(shipment)}
                                    className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                                >
                                    More Options <ChevronRight size={14} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2 items-end">
                                {shipment.status === 'ASSIGNED' && (
                                    <button
                                        onClick={() => updateStatus(shipment.id, 'DISPATCHED')}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
                                    >
                                        <Package size={18} /> Pick Up
                                    </button>
                                )}
                                {shipment.status === 'DISPATCHED' && (
                                    <button
                                        onClick={() => updateStatus(shipment.id, 'OUT_FOR_DELIVERY')}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2 font-medium"
                                    >
                                        <Truck size={18} /> Start Delivery
                                    </button>
                                )}
                                {shipment.status === 'OUT_FOR_DELIVERY' && (
                                    <button
                                        onClick={() => updateStatus(shipment.id, 'DELIVERED')}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
                                    >
                                        <CheckCircle size={18} /> Mark Delivered
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {shipments.length === 0 && <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">No active shipments found.</div>}
                </div>
            )}

            {/* Modal */}
            {selectedShipment && (
                <AgentShipmentModal
                    shipment={selectedShipment}
                    onClose={() => setSelectedShipment(null)}
                />
            )}
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'CREATED': return 'bg-gray-200';
        case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
        case 'DISPATCHED': return 'bg-indigo-100 text-indigo-800';
        case 'OUT_FOR_DELIVERY': return 'bg-yellow-100 text-yellow-800';
        case 'DELIVERED': return 'bg-green-100 text-green-800';
        default: return 'bg-red-100';
    }
};

export default AgentDashboard;
