import { useState, useEffect } from 'react';
import api from '../../../api/api';
import { IndianRupee, MapPin } from 'lucide-react';

const AgentEarnings = () => {
    const [earnings, setEarnings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const response = await api.get('/logistics/agent/earnings');
                setEarnings(response.data);
            } catch (error) {
                console.error("Failed to fetch earnings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, []);

    const totalEarnings = earnings.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalDistance = earnings.reduce((sum, e) => sum + (e.distanceKm || 0), 0);

    if (loading) return <div className="p-4 text-center">Loading Earnings...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-700 mb-1">
                        <IndianRupee size={20} />
                        <span className="font-medium">Total Earnings</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toFixed(2)}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                        <MapPin size={20} />
                        <span className="font-medium">Total Distance</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(1)} km</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {earnings.map(earning => (
                            <tr key={earning.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(earning.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    #{earning.shipmentId?.substring(0, 8) || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {earning.distanceKm} km
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                    ₹{earning.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {earnings.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No earnings recorded yet.</div>
                )}
            </div>
        </div>
    );
};

export default AgentEarnings;
