import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/api';
import { Search, Filter, Eye } from 'lucide-react';

import { 
    GlassTableWrapper, 
    GlassThead, 
    GlassTh, 
    GlassTbody, 
    GlassTr, 
    GlassTd, 
    GlassBadge, 
    GlassIconButton 
} from '../../../components/ui/GlassTable';

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

    const getStatusVariant = (status) => {
        switch (status) {
            case 'PENDING_DOCS': return 'warning';
            case 'PENDING_BANK': return 'primary';
            case 'COMPLETED': return 'success';
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'danger';
            case 'DOCUMENTS_REJECTED': return 'danger';
            case 'BANK_REJECTED': return 'danger';
            case 'SUSPENDED': return 'default';
            default: return 'default';
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
                <GlassTableWrapper>
                    <GlassThead>
                        <GlassTh>Seller</GlassTh>
                        <GlassTh>Business Name</GlassTh>
                        <GlassTh>Contact</GlassTh>
                        <GlassTh>Status</GlassTh>
                        <GlassTh>Action</GlassTh>
                    </GlassThead>
                    <GlassTbody>
                        {filteredSellers.map((seller, index) => (
                            <GlassTr key={seller.id} index={index}>
                                <GlassTd>
                                    <p className="font-medium">{seller.fullName}</p>
                                </GlassTd>
                                <GlassTd className="text-text-secondary dark:text-white/80">
                                    {seller.shopName || '-'}
                                </GlassTd>
                                <GlassTd>
                                    <p>{seller.email}</p>
                                    <p className="text-text-secondary dark:text-white/60 text-xs">{seller.phoneNumber}</p>
                                </GlassTd>
                                <GlassTd>
                                    <GlassBadge variant={getStatusVariant(seller.registrationStatus)}>
                                        {seller.registrationStatus?.replace('_', ' ')}
                                    </GlassBadge>
                                </GlassTd>
                                <GlassTd>
                                    <GlassIconButton 
                                        icon={Eye} 
                                        onClick={() => navigate(`/admin/sellers/${seller.id}`)}
                                        colorClass="text-primary hover:text-primary dark:text-white dark:hover:text-primary"
                                    />
                                </GlassTd>
                            </GlassTr>
                        ))}
                    </GlassTbody>
                </GlassTableWrapper>
            )}
        </div>
    );
};

export default AdminSellersList;
