import { useState, useEffect } from 'react';
import api from '../../../api/api';
import { Plus, UserPlus, Map, Truck, Package, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminShipmentManager = () => {
    const [shipments, setShipments] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgents, setSelectedAgents] = useState({}); // Map shipmentId -> agentId

    useEffect(() => {
        fetchData();
    }, []);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [shipmentsRes, agentsRes] = await Promise.all([
                api.get('/logistics/shipments/admin/all'),
                api.get('/admin/agents')
            ]);
            setShipments(shipmentsRes.data);
            setAgents(agentsRes.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
            Swal.fire('Error', 'Failed to load shipments or agents', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleViewProof = async (shipmentId) => {
        try {
            Swal.showLoading();
            // Use the new Admin Proof Endpoint
            const response = await api.get(`/admin/delivery-proof/${shipmentId}`);
            const proof = response.data;

            if (proof && proof.imageUrl) {
                Swal.fire({
                    title: 'Delivery Proof',
                    imageUrl: proof.imageUrl,
                    imageAlt: 'Delivery Proof',
                    width: 600,
                    showCloseButton: true,
                    showConfirmButton: false
                });
            } else {
                Swal.fire('Info', 'No proof image available', 'info');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Info', 'Proof not found or not uploaded yet', 'info');
        }
    };

    const handleCreateShipment = async (orderId) => {
        if (!orderId) return;
        try {
            await api.post(`/logistics/shipments/admin/create?orderId=${orderId}`);
            fetchData();
            Swal.fire('Success', 'Shipment Created Successfully', 'success');
        } catch (err) {
            Swal.fire('Error', 'Failed to create shipment', 'error');
        }
    };

    const handleAssignAgent = async (shipmentId) => {
        const agentId = selectedAgents[shipmentId];
        if (!agentId) {
            Swal.fire('Warning', 'Please select an agent first', 'warning');
            return;
        }

        try {
            await api.put(`/logistics/shipments/admin/assign/${shipmentId}/${agentId}`);
            fetchData();
            Swal.fire('Success', 'Agent Assigned Successfully', 'success');
            setSelectedAgents(prev => {
                const newState = { ...prev };
                delete newState[shipmentId];
                return newState;
            });
        } catch (err) {
            Swal.fire('Error', 'Failed to assign agent', 'error');
        }
    };

    const handleAgentSelect = (shipmentId, agentId) => {
        setSelectedAgents(prev => ({
            ...prev,
            [shipmentId]: agentId
        }));
    };

    if (loading) return <div className="p-6">Loading Shipments...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <Truck className="text-orange-600" /> Shipment Management
            </h1>

            {/* Quick Test Create */}
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Quick Create:</span>
                <input
                    type="text"
                    placeholder="Enter Order ID (UUID)"
                    id="orderInput"
                    className="border p-2 rounded w-80 focus:ring-2 focus:ring-orange-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                    onClick={() => handleCreateShipment(document.getElementById('orderInput').value)}
                    className="bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-orange-700 transition"
                >
                    <Plus size={18} /> Create Shipment
                </button>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm uppercase">
                        <tr>
                            <th className="p-4">Shipment ID</th>
                            <th className="p-4">Order Details</th>
                            <th className="p-4">Customer Info</th>
                            <th className="p-4">Current Status</th>
                            <th className="p-4">Assigned Agent</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {shipments.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <td className="p-4 text-xs font-mono text-gray-500 dark:text-gray-400">#{s.id.substring(0, 8)}</td>
                                <td className="p-4">
                                    <div className="font-semibold text-gray-800 dark:text-white">Order: #{s.orderId.substring(0, 8)}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-800 dark:text-white">{s.customerName}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.shippingAddress}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                        ${s.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                            s.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                                s.status === 'OUT_FOR_DELIVERY' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                                                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                        {s.status}
                                    </span>
                                    {s.status === 'DELIVERED' && (
                                        <button
                                            onClick={() => handleViewProof(s.id)}
                                            className="ml-2 p-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
                                            title="View Proof"
                                        >
                                            <Eye size={14} />
                                        </button>
                                    )}
                                </td>
                                <td className="p-4">
                                    {s.agentName ? (
                                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg inline-block">
                                            <UserPlus size={14} /> {s.agentName}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <select
                                                className="border rounded p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                value={selectedAgents[s.id] || ''}
                                                onChange={(e) => handleAgentSelect(s.id, e.target.value)}
                                            >
                                                <option value="">Select Agent</option>
                                                {agents.map(a => (
                                                    <option key={a.id} value={a.id}>{a.fullName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </td>
                                <td className="p-4">
                                    {!s.agentId ? (
                                        <button
                                            onClick={() => handleAssignAgent(s.id)}
                                            disabled={!selectedAgents[s.id]}
                                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition
                                                ${selectedAgents[s.id]
                                                    ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-sm'
                                                    : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'}`}
                                        >
                                            <UserPlus size={16} /> Assign
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 text-sm italic">Assigned</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {shipments.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    <Package className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                                    No shipments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminShipmentManager;
