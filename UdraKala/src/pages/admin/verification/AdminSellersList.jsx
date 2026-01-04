import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/api';
import { Search, Filter, Eye } from 'lucide-react';

const AdminSellersList = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            const res = await API.get('/admin/seller-verification/sellers');
            setSellers(res.data);
        } catch (error) {
            console.error("Failed to fetch sellers", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING_DOCS': return 'bg-yellow-100 text-yellow-800';
            case 'PENDING_BANK': return 'bg-blue-100 text-blue-800';
            case 'COMPLETED': return 'bg-green-100 text-green-800'; // Wait admin
            case 'APPROVED': return 'bg-green-600 text-white';
            case 'REJECTED': return 'bg-red-600 text-white';
            case 'DOCUMENTS_REJECTED': return 'bg-orange-100 text-orange-800';
            case 'BANK_REJECTED': return 'bg-pink-100 text-pink-800';
            case 'SUSPENDED': return 'bg-gray-600 text-white';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    const filteredSellers = filterStatus === 'ALL'
        ? sellers
        : sellers.filter(s => s.registrationStatus === filterStatus);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Seller Verifications</h1>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="relative">
                    <select
                        className="appearance-none bg-white dark:bg-gray-700 border dark:border-gray-600 rounded px-4 py-2 pr-8 leading-tight focus:outline-none focus:shadow-outline text-gray-700 dark:text-gray-200"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING_DOCS">Pending Documents</option>
                        <option value="PENDING_BANK">Pending Bank</option>
                        <option value="COMPLETED">Ready for Approval</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Seller
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Business Name
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSellers.map((seller) => (
                                <tr key={seller.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                <p className="text-gray-900 dark:text-white whitespace-no-wrap">
                                                    {seller.fullName}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{seller.shopName || '-'}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{seller.email}</p>
                                        <p className="text-gray-600 dark:text-gray-400 whitespace-no-wrap text-xs">{seller.phoneNumber}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${getStatusColor(seller.registrationStatus)}`}>
                                            <span className="relative text-xs">{seller.registrationStatus?.replace('_', ' ')}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                        <button
                                            onClick={() => navigate(`/admin/sellers/${seller.id}`)}
                                            className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 flex items-center gap-1"
                                        >
                                            <Eye size={16} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminSellersList;
