import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../../api/api';
import Swal from 'sweetalert2';
import { Check, X, AlertTriangle, FileText, CreditCard, Activity } from 'lucide-react';

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

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                    <img
                        src={`http://localhost:8080${seller.profilePictureUrl || '/uploads/default-profile.png'}`}
                        alt={seller.fullName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                    />
                    <div>
                        <h1 className="text-3xl font-bold">{seller.fullName}</h1>
                        <p className="text-gray-600 font-medium text-lg">{seller.shopName}</p>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            {seller.email} | {seller.phoneNumber}
                        </p>
                        <div className="mt-2 flex gap-2">
                            <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold uppercase tracking-wider">{seller.registrationStatus.replace('_', ' ')}</span>
                            {seller.businessType && <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold">{seller.businessType}</span>}
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
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-2 border-b pb-2">Business Address</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><span className="block text-gray-500">Address</span>{seller.address || 'N/A'}</div>
                    <div><span className="block text-gray-500">City</span>{seller.city || 'N/A'}</div>
                    <div><span className="block text-gray-500">State</span>{seller.state || 'N/A'}</div>
                    <div><span className="block text-gray-500">Pincode</span>{seller.pincode || 'N/A'}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
                <nav className="-mb-px flex gap-6">
                    <button onClick={() => setActiveTab('docs')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'docs' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        Documents Verification
                    </button>
                    <button onClick={() => setActiveTab('bank')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'bank' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        Bank Details
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`py-4 px-1 border-b-2 font-medium ${activeTab === 'history' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        Activity Log
                    </button>
                </nav>
            </div>

            {/* TAB CONTENT: DOCUMENTS */}
            {activeTab === 'docs' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Data Panel */}
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="font-bold text-lg mb-4">Submitted Identifiers</h3>
                        <div className="space-y-3">
                            <div><span className="font-semibold">PAN:</span> {documents?.panNumber || 'N/A'}</div>
                            <div><span className="font-semibold">Aadhaar:</span> {documents?.aadhaarNumber || 'N/A'}</div>
                            <div><span className="font-semibold">GSTIN:</span> {documents?.gstNumber || 'N/A'}</div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            {!documents?.verified ? (
                                <>
                                    <button onClick={() => handleAction('Verify Docs', 'verify-documents')} className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded border border-green-200 hover:bg-green-200">
                                        <Check size={18} /> Approve Docs
                                    </button>
                                    <button onClick={() => handleAction('Reject Docs', 'reject-documents', true)} className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded border border-red-200 hover:bg-red-200">
                                        <X size={18} /> Reject
                                    </button>
                                </>
                            ) : (
                                <div className="text-green-600 flex items-center gap-2 font-bold"><Check size={20} /> Documents Verified</div>
                            )}
                        </div>
                    </div>

                    {/* Preview Panel (Assuming local file serving setup or cloud URL) */}
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="font-bold text-lg mb-4">File Previews</h3>
                        <div className="space-y-6">
                            {documents?.panFileUrl && (
                                <div>
                                    <p className="font-semibold mb-1">PAN Card</p>
                                    <a href={`http://localhost:8080${documents.panFileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">View Document</a>
                                    {/* <img src={`http://localhost:8080${documents.panFileUrl}`} alt="PAN" className="h-32 object-cover border rounded mt-2"/> */}
                                </div>
                            )}
                            {documents?.aadhaarFileUrl && (
                                <div>
                                    <p className="font-semibold mb-1">Aadhaar Card</p>
                                    <a href={`http://localhost:8080${documents.aadhaarFileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">View Document</a>
                                </div>
                            )}
                            {documents?.gstFileUrl && (
                                <div>
                                    <p className="font-semibold mb-1">GST Certificate</p>
                                    <a href={`http://localhost:8080${documents.gstFileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">View Document</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: BANK */}
            {activeTab === 'bank' && (
                <div className="bg-white p-6 rounded shadow max-w-2xl">
                    <h3 className="font-bold text-lg mb-4">Bank Information</h3>
                    {!bankDetails ? <p>No bank details submitted yet.</p> : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-gray-500 text-sm">Account Holder</label><p className="font-medium">{bankDetails.accountHolderName}</p></div>
                                <div><label className="text-gray-500 text-sm">Bank Name</label><p className="font-medium">{bankDetails.bankName}</p></div>
                                <div><label className="text-gray-500 text-sm">Account Number</label><p className="font-medium">{bankDetails.accountNumber}</p></div>
                                <div><label className="text-gray-500 text-sm">IFSC Code</label><p className="font-medium">{bankDetails.ifscCode}</p></div>
                            </div>

                            <div className="mt-6 border-t pt-4 flex gap-3">
                                {!bankDetails.verified ? (
                                    <>
                                        <button onClick={() => handleAction('Verify Bank', 'verify-bank')} className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded border border-green-200 hover:bg-green-200">
                                            <Check size={18} /> Approve Bank
                                        </button>
                                        <button onClick={() => handleAction('Reject Bank', 'reject-bank', true)} className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded border border-red-200 hover:bg-red-200">
                                            <X size={18} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-green-600 flex items-center gap-2 font-bold"><Check size={20} /> Bank Verified</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: HISTORY */}
            {activeTab === 'history' && (
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Action</th>
                                <th className="px-6 py-3">Reason / Details</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs?.length === 0 && <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No logs found</td></tr>}
                            {logs?.map((log) => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 font-medium text-gray-900">{log.actionType}</td>
                                    <td className="px-6 py-4 text-gray-700">{log.reason || '-'}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{new Date(log.createdAt).toLocaleString()}</td>
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
