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
            case 'PENDING_BANK': return 'bg-primary-light text-primary';
            case 'COMPLETED': return 'bg-green-100 text-green-800'; // Wait admin
            case 'APPROVED': return 'bg-status-success text-text-onDark';
            case 'REJECTED': return 'bg-status-error text-text-onDark';
            case 'DOCUMENTS_REJECTED': return 'bg-primary-light text-primary';
            case 'BANK_REJECTED': return 'bg-pink-100 text-pink-800';
            case 'SUSPENDED': return 'bg-bg-dark text-text-onDark';
            default: return 'bg-bg-band text-text-primary';
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
                        className="appearance-none bg-bg-surface dark:bg-bg-dark/50 border border-border dark:border-transparent rounded-lg shadow-sm dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] px-4 py-2 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-secondary dark:text-text-secondary transition-all"
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
                <div className="bg-bg-surface dark:bg-bg-dark shadow-sm dark:shadow-[0_4px_6px_rgba(0,0,0,0.4)] rounded-lg border border-border dark:border-transparent overflow-hidden">
                    <table className="min-w-full leading-normal border-collapse">
                        <thead>
                            <tr className="bg-bg-page/50 dark:bg-white/[0.02]">
                                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">
                                    Seller
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">
                                    Business Name
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-text-secondary dark:text-text-secondary uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 dark:divide-white/5">
                            {filteredSellers.map((seller) => (
                                <tr key={seller.id} className="hover:bg-primary/5 dark:hover:bg-white/[0.03] transition-colors">
                                    <td className="px-5 py-4 text-sm">
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                <p className="text-text-primary dark:text-text-onDark whitespace-no-wrap font-medium">
                                                    {seller.fullName}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-text-secondary dark:text-text-secondary">
                                        <p className="whitespace-no-wrap">{seller.shopName || '-'}</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <p className="text-text-primary dark:text-text-onDark whitespace-no-wrap">{seller.email}</p>
                                        <p className="text-text-secondary dark:text-text-secondary whitespace-no-wrap text-xs">{seller.phoneNumber}</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${getStatusColor(seller.registrationStatus)}`}>
                                            <span className="relative text-xs">{seller.registrationStatus?.replace('_', ' ')}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <button
                                            onClick={() => navigate(`/admin/sellers/${seller.id}`)}
                                            className="p-1.5 hover:bg-bg-band dark:hover:bg-bg-dark rounded-lg text-text-secondary hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1"
                                        >
                                            <Eye size={18} /> <span className="hidden sm:inline">View</span>
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
