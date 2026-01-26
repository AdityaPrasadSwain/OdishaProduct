import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../../api/api';
import Swal from 'sweetalert2';
import { Check, X, AlertTriangle, FileText, CreditCard, Activity, User } from 'lucide-react';
import defaultUser from '../../../assets/default-user.jpg';

const AdminSellerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('docs'); // docs, bank, history

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await API.get(`/admin/seller-verification/sellers/${id}`);
            setData(res.data);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch details', 'error');
            navigate('/admin/sellers');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action, endpoint, reasonReq = false) => {
        let reason = null;
        // ... (SweetAlert logic remains same, implicit in target matching usually, but need to be careful)
        if (reasonReq) {
            const { value: text } = await Swal.fire({
                title: 'Reason for Rejection',
                input: 'textarea',
                inputPlaceholder: 'Enter reason...',
                showCancelButton: true
            });
            if (!text) return; // Cancelled
            reason = text;
        } else {
            const confirm = await Swal.fire({
                title: 'Are you sure?',
                text: `You are about to ${action.toLowerCase()}.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, proceed'
            });
            if (!confirm.isConfirmed) return;
        }

        try {
            // Updated endpoint structure: /admin/seller-verification/{id}/{endpoint}
            await API.post(`/admin/seller-verification/${id}/${endpoint}`, reason ? { reason } : {});
            Swal.fire('Success', 'Action completed', 'success');
            fetchDetails(); // Refresh
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Action failed', 'error');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>Not found</div>;

    const { seller, documents, bankDetails, logs } = data;

    const getFileUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        // Ensure path starts with / if not present
        const safePath = path.startsWith('/') ? path : `/${path}`;
        return `http://localhost:8086${safePath}`;
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                    {getFileUrl(seller.profilePictureUrl) ? (
                        <img
                            src={getFileUrl(seller.profilePictureUrl)}
                            alt={seller.fullName}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            onError={(e) => { e.target.onerror = null; e.target.src = defaultUser; }}
                        />
                    ) : (
                        <img
                            src={defaultUser}
                            alt={seller.fullName}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{seller.fullName}</h1>
                        <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">{seller.shopName}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                            {seller.email} | {seller.phoneNumber}
                        </p>
                        <div className="mt-2 flex gap-2">
                            <span className="px-3 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs font-bold uppercase tracking-wider">{seller.registrationStatus.replace('_', ' ')}</span>
                            {seller.businessType && <span className="px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 rounded-full text-xs font-bold">{seller.businessType}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {seller.registrationStatus === 'PENDING_VERIFICATION' && (
                        <button onClick={() => handleAction('Approve Seller', 'approve')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow font-bold">
                            Final Approve
                        </button>
                    )}
                    {!seller.isBlocked && seller.registrationStatus === 'APPROVED' && (
                        <button onClick={() => handleAction('Suspend', 'suspend', true)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            Suspend
                        </button>
                    )}
                    {seller.isBlocked && (
                        <button onClick={() => handleAction('Activate', 'activate')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Re-Activate
                        </button>
                    )}
                </div>
            </div>

            {/* Address & Business Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">Business Address</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><span className="block text-gray-500 dark:text-gray-400">Address</span><span className="text-gray-900 dark:text-gray-200">{seller.address || 'N/A'}</span></div>
                    <div><span className="block text-gray-500 dark:text-gray-400">City</span><span className="text-gray-900 dark:text-gray-200">{seller.city || 'N/A'}</span></div>
                    <div><span className="block text-gray-500 dark:text-gray-400">State</span><span className="text-gray-900 dark:text-gray-200">{seller.state || 'N/A'}</span></div>
                    <div><span className="block text-gray-500 dark:text-gray-400">Pincode</span><span className="text-gray-900 dark:text-gray-200">{seller.pincode || 'N/A'}</span></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex gap-6">
                    <button onClick={() => setActiveTab('docs')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'docs' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                        Documents Verification
                    </button>
                    <button onClick={() => setActiveTab('bank')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'bank' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                        Bank Details
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'history' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                        Activity Log
                    </button>
                </nav>
            </div>

            {/* TAB CONTENT: DOCUMENTS */}
            {activeTab === 'docs' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Data Panel */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Submitted Identifiers</h3>
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <div><span className="font-semibold text-gray-500 dark:text-gray-400">PAN:</span> {documents?.panNumber || 'N/A'}</div>
                            <div><span className="font-semibold text-gray-500 dark:text-gray-400">Aadhaar:</span> {documents?.aadhaarNumber || 'N/A'}</div>
                            <div><span className="font-semibold text-gray-500 dark:text-gray-400">GSTIN:</span> {documents?.gstNumber || 'N/A'}</div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            {!documents?.verified ? (
                                <>
                                    <button onClick={() => handleAction('Verify Docs', 'verify-documents')} className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50">
                                        <Check size={18} /> Approve Docs
                                    </button>
                                    <button onClick={() => handleAction('Reject Docs', 'reject-documents', true)} className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded border border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50">
                                        <X size={18} /> Reject
                                    </button>
                                </>
                            ) : (
                                <div className="text-green-600 dark:text-green-400 flex items-center gap-2 font-bold"><Check size={20} /> Documents Verified</div>
                            )}
                        </div>
                    </div>

                    {/* Preview Panel (Assuming local file serving setup or cloud URL) */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">File Previews</h3>
                        <div className="space-y-6">
                            {documents?.panFileUrl && (
                                <div>
                                    <p className="font-semibold mb-1 text-gray-700 dark:text-gray-300">PAN Card</p>
                                    <a href={getFileUrl(documents.panFileUrl)} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline text-sm">View Document</a>
                                </div>
                            )}
                            {documents?.aadhaarFileUrl && (
                                <div>
                                    <p className="font-semibold mb-1 text-gray-700 dark:text-gray-300">Aadhaar Card</p>
                                    <a href={getFileUrl(documents.aadhaarFileUrl)} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline text-sm">View Document</a>
                                </div>
                            )}
                            {documents?.gstFileUrl && (
                                <div>
                                    <p className="font-semibold mb-1 text-gray-700 dark:text-gray-300">GST Certificate</p>
                                    <a href={getFileUrl(documents.gstFileUrl)} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline text-sm">View Document</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: BANK */}
            {activeTab === 'bank' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-2xl border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Bank Information</h3>
                    {!bankDetails ? <p className="text-gray-500 dark:text-gray-400">No bank details submitted yet.</p> : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-gray-500 dark:text-gray-400 text-sm">Account Holder</label><p className="font-medium text-gray-900 dark:text-gray-200">{bankDetails.accountHolderName}</p></div>
                                <div><label className="text-gray-500 dark:text-gray-400 text-sm">Bank Name</label><p className="font-medium text-gray-900 dark:text-gray-200">{bankDetails.bankName}</p></div>
                                <div><label className="text-gray-500 dark:text-gray-400 text-sm">Account Number</label><p className="font-medium text-gray-900 dark:text-gray-200">{bankDetails.accountNumber}</p></div>
                                <div><label className="text-gray-500 dark:text-gray-400 text-sm">IFSC Code</label><p className="font-medium text-gray-900 dark:text-gray-200">{bankDetails.ifscCode}</p></div>
                            </div>

                            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 flex gap-3">
                                {!bankDetails.verified ? (
                                    <>
                                        <button onClick={() => handleAction('Verify Bank', 'verify-bank')} className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50">
                                            <Check size={18} /> Approve Bank
                                        </button>
                                        <button onClick={() => handleAction('Reject Bank', 'reject-bank', true)} className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded border border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50">
                                            <X size={18} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-green-600 dark:text-green-400 flex items-center gap-2 font-bold"><Check size={20} /> Bank Verified</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: HISTORY */}
            {activeTab === 'history' && (
                <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden border border-gray-100 dark:border-gray-700">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Action</th>
                                <th className="px-6 py-3">Reason / Details</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {logs?.length === 0 && <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No logs found</td></tr>}
                            {logs?.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{log.actionType}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{log.reason || '-'}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{new Date(log.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminSellerDetails;
