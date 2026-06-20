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
                    <p className="text-2xl font-bold text-text-primary">₹{totalEarnings.toFixed(2)}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-primary">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <MapPin size={20} />
                        <span className="font-medium">Total Distance</span>
                    </div>
                    <p className="text-2xl font-bold text-text-primary">{totalDistance.toFixed(1)} km</p>
                </div>
            </div>

            <div className="bg-bg-surface rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-bg-page">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Distance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-bg-surface divide-y divide-gray-200">
                        {earnings.map(earning => (
                            <tr key={earning.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                    {new Date(earning.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                                    #{earning.shipmentId?.substring(0, 8) || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                    {earning.distanceKm} km
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-status-success">
                                    ₹{earning.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {earnings.length === 0 && (
                    <div className="p-8 text-center text-text-secondary">No earnings recorded yet.</div>
                )}
            </div>
        </div>
    );
};

export default AgentEarnings;
