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
                        <h1 className="text-3xl font-bold text-text-primary dark:text-text-secondary">{seller.fullName}</h1>
                        <p className="text-text-secondary dark:text-text-secondary font-medium text-lg">{seller.shopName}</p>
                        <p className="text-text-secondary dark:text-text-secondary text-sm flex items-center gap-2">
                            {seller.email} | {seller.phoneNumber}
                        </p>
                        <div className="mt-2 flex gap-2">
                            <span className="px-3 py-1 bg-bg-band text-text-primary dark:bg-bg-dark dark:text-text-secondary rounded-full text-xs font-bold uppercase tracking-wider">{seller.registrationStatus.replace('_', ' ')}</span>
                            {seller.businessType && <span className="px-3 py-1 bg-primary-light text-primary dark:bg-primary-hover/40 dark:text-primary rounded-full text-xs font-bold">{seller.businessType}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {seller.registrationStatus === 'PENDING_VERIFICATION' && (
                        <button onClick={() => handleAction('Approve Seller', 'approve')} className="bg-status-success text-text-onDark px-4 py-2 rounded hover:bg-green-700 shadow font-bold">
                            Final Approve
                        </button>
                    )}
                    {!seller.isBlocked && seller.registrationStatus === 'APPROVED' && (
                        <button onClick={() => handleAction('Suspend', 'suspend', true)} className="bg-status-error text-text-onDark px-4 py-2 rounded hover:text-status-error">
                            Suspend
                        </button>
                    )}
                    {seller.isBlocked && (
                        <button onClick={() => handleAction('Activate', 'activate')} className="bg-primary text-text-onDark px-4 py-2 rounded hover:bg-primary-hover">
                            Re-Activate
                        </button>
                    )}
                </div>
            </div>

            {/* Address & Business Card */}
            <div className="bg-bg-surface dark:bg-bg-dark p-6 rounded-lg shadow-sm mb-6 border border-border dark:border-border">
                <h3 className="font-bold text-text-primary dark:text-text-secondary mb-2 border-b border-border dark:border-border pb-2">Business Address</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><span className="block text-text-secondary dark:text-text-secondary">Address</span><span className="text-text-primary dark:text-text-secondary">{seller.address || 'N/A'}</span></div>
                    <div><span className="block text-text-secondary dark:text-text-secondary">City</span><span className="text-text-primary dark:text-text-secondary">{seller.city || 'N/A'}</span></div>
                    <div><span className="block text-text-secondary dark:text-text-secondary">State</span><span className="text-text-primary dark:text-text-secondary">{seller.state || 'N/A'}</span></div>
                    <div><span className="block text-text-secondary dark:text-text-secondary">Pincode</span><span className="text-text-primary dark:text-text-secondary">{seller.pincode || 'N/A'}</span></div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border dark:border-border mb-6">
                <nav className="-mb-px flex gap-6">
                    <button onClick={() => setActiveTab('docs')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'docs' ? 'border-primary text-primary' : 'border-transparent text-text-secondary dark:text-text-secondary hover:text-text-secondary dark:hover:text-text-secondary'}`}>
                        Documents Verification
                    </button>
                    <button onClick={() => setActiveTab('bank')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'bank' ? 'border-primary text-primary' : 'border-transparent text-text-secondary dark:text-text-secondary hover:text-text-secondary dark:hover:text-text-secondary'}`}>
                        Bank Details
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-text-secondary dark:text-text-secondary hover:text-text-secondary dark:hover:text-text-secondary'}`}>
                        Activity Log
                    </button>
                </nav>
            </div>

            {/* TAB CONTENT: DOCUMENTS */}
            {activeTab === 'docs' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Data Panel */}
                    <div className="bg-bg-surface dark:bg-bg-dark p-6 rounded shadow border border-border dark:border-border">
                        <h3 className="font-bold text-lg mb-4 text-text-primary dark:text-text-secondary">Submitted Identifiers</h3>
                        <div className="space-y-3 text-text-secondary dark:text-text-secondary">
                            <div><span className="font-semibold text-text-secondary dark:text-text-secondary">PAN:</span> {documents?.panNumber || 'N/A'}</div>
                            <div><span className="font-semibold text-text-secondary dark:text-text-secondary">Aadhaar:</span> {documents?.aadhaarNumber || 'N/A'}</div>
                            <div><span className="font-semibold text-text-secondary dark:text-text-secondary">GSTIN:</span> {documents?.gstNumber || 'N/A'}</div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            {!documents?.verified ? (
                                <>
                                    <button onClick={() => handleAction('Verify Docs', 'verify-documents')} className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50">
                                        <Check size={18} /> Approve Docs
                                    </button>
                                    <button onClick={() => handleAction('Reject Docs', 'reject-documents', true)} className="flex items-center gap-2 text-status-error dark:text-status-error/30 text-status-error dark:text-red-400 px-4 py-2 rounded border border-red-200 dark:border-red-800 hover:text-status-error dark:hover:text-status-error/50">
                                        <X size={18} /> Reject
                                    </button>
                                </>
                            ) : (
                                <div className="text-status-success dark:text-green-400 flex items-center gap-2 font-bold"><Check size={20} /> Documents Verified</div>
                            )}
                        </div>
                    </div>

                    {/* Preview Panel (Assuming local file serving setup or cloud URL) */}
                    <div className="bg-bg-surface dark:bg-bg-dark p-6 rounded shadow border border-border dark:border-border">
                        <h3 className="font-bold text-lg mb-4 text-text-primary dark:text-text-secondary">File Previews</h3>
                        <div className="space-y-6">
                            {documents?.panFileUrl && (
                                <div>
                                    <p className="font-semibold mb-1 text-text-secondary dark:text-text-secondary">PAN Card</p>
                                    <a href={getFileUrl(documents.panFileUrl)} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-primary underline text-sm">View Document</a>
                                </div>
                            )}
                            {documents?.aadhaarFileUrl && (
                                <div>
                                    <p className="font-semibold mb-1 text-text-secondary dark:text-text-secondary">Aadhaar Card</p>
                                    <a href={getFileUrl(documents.aadhaarFileUrl)} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-primary underline text-sm">View Document</a>
                                </div>
                            )}
                            {documents?.gstFileUrl && (
                                <div>
                                    <p className="font-semibold mb-1 text-text-secondary dark:text-text-secondary">GST Certificate</p>
                                    <a href={getFileUrl(documents.gstFileUrl)} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-primary underline text-sm">View Document</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: BANK */}
            {activeTab === 'bank' && (
                <div className="bg-bg-surface dark:bg-bg-dark p-6 rounded shadow max-w-2xl border border-border dark:border-border">
                    <h3 className="font-bold text-lg mb-4 text-text-primary dark:text-text-secondary">Bank Information</h3>
                    {!bankDetails ? <p className="text-text-secondary dark:text-text-secondary">No bank details submitted yet.</p> : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-text-secondary dark:text-text-secondary text-sm">Account Holder</label><p className="font-medium text-text-primary dark:text-text-secondary">{bankDetails.accountHolderName}</p></div>
                                <div><label className="text-text-secondary dark:text-text-secondary text-sm">Bank Name</label><p className="font-medium text-text-primary dark:text-text-secondary">{bankDetails.bankName}</p></div>
                                <div><label className="text-text-secondary dark:text-text-secondary text-sm">Account Number</label><p className="font-medium text-text-primary dark:text-text-secondary">{bankDetails.accountNumber}</p></div>
                                <div><label className="text-text-secondary dark:text-text-secondary text-sm">IFSC Code</label><p className="font-medium text-text-primary dark:text-text-secondary">{bankDetails.ifscCode}</p></div>
                            </div>

                            <div className="mt-6 border-t border-border dark:border-border pt-4 flex gap-3">
                                {!bankDetails.verified ? (
                                    <>
                                        <button onClick={() => handleAction('Verify Bank', 'verify-bank')} className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50">
                                            <Check size={18} /> Approve Bank
                                        </button>
                                        <button onClick={() => handleAction('Reject Bank', 'reject-bank', true)} className="flex items-center gap-2 text-status-error dark:text-status-error/30 text-status-error dark:text-red-400 px-4 py-2 rounded border border-red-200 dark:border-red-800 hover:text-status-error dark:hover:text-status-error/50">
                                            <X size={18} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-status-success dark:text-green-400 flex items-center gap-2 font-bold"><Check size={20} /> Bank Verified</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: HISTORY */}
            {activeTab === 'history' && (
                <div className="bg-bg-surface dark:bg-bg-dark rounded shadow overflow-hidden border border-border dark:border-border">
                    <table className="min-w-full text-left">
                        <thead className="bg-bg-page dark:bg-bg-dark/50 text-text-secondary dark:text-text-secondary uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Action</th>
                                <th className="px-6 py-3">Reason / Details</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {logs?.length === 0 && <tr><td colSpan="3" className="px-6 py-4 text-center text-text-secondary dark:text-text-secondary">No logs found</td></tr>}
                            {logs?.map((log) => (
                                <tr key={log.id} className="hover:bg-bg-page dark:hover:bg-bg-dark/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-text-primary dark:text-text-secondary">{log.actionType}</td>
                                    <td className="px-6 py-4 text-text-secondary dark:text-text-secondary">{log.reason || '-'}</td>
                                    <td className="px-6 py-4 text-text-secondary dark:text-text-secondary text-sm">{new Date(log.createdAt).toLocaleString()}</td>
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
