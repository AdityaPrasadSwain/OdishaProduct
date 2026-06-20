import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Trash2,
    ShoppingBag,
    Users,
    Package,
    Layers,
    Ticket,
    LogOut,
    ChevronDown,
    User,
    Settings,
    LayoutDashboard
} from 'lucide-react';
import AdminCouponList from './coupons/AdminCouponList'; // New Import
import API from '../../api/api';
import Swal from 'sweetalert2';
import { sendSellerApprovalEmail } from '../../utils/emailService';
import AnalyticsDashboard from './AnalyticsDashboard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import StatsCard from '../../components/admin/StatsCard';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ScrollReveal from '../../components/ui/ScrollReveal';
import { getUnreadNotificationCount } from '../../api/adminNotificationApi';
import AdminCategories from './AdminCategories';
import AdminReturnManagement from './AdminReturnManagement';
import { useTheme } from '../../context/ThemeContext';
import { DataGrid } from '@mui/x-data-grid';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    // Local state for admin data
    const [products, setProducts] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [coupons, setCoupons] = useState([]); // New state for coupon stats
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout } = useAuth();

    // Categories now handled by AdminCategories component

    const [features, setFeatures] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

    // Check for alerts on mount
    // Check for alerts on mount - Removed to prevent duplicate alerts (handled by Bell)
    /* useEffect(() => {
        const checkAlerts = async () => {
            const count = await getUnreadNotificationCount();
            if (count > 0) {
                Swal.fire({
                    title: 'Pending Actions',
                    text: `You have ${count} unread notifications requiring attention.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Go to Notifications',
                    cancelButtonText: 'Close'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/admin/notifications');
                    }
                });
            }
        };
        checkAlerts();
    }, [navigate]); */

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const prodRes = await API.get('/admin/products');
                setProducts(prodRes.data || []);
                const sellerRes = await API.get('/admin/sellers');
                setSellers(sellerRes.data || []);

                const couponRes = await API.get('/admin/coupons'); // Fetch coupons for stats
                setCoupons(couponRes.data || []);

                // Categories fetch removed as AdminCategories handles it

                const featRes = await API.get('/features');
                setFeatures(featRes.data || []);
            } catch (err) {
                console.error("Failed to fetch admin dashboard data", err);
            }
        };
        fetchData();
    }, []);

    // Form States
    const [featName, setFeatName] = useState('');
    const [featDesc, setFeatDesc] = useState('');

    // --- Action Handlers (Kept logic same) ---
    const handleApprove = async (id) => {
        try {
            await API.put(`/admin/sellers/${id}/approve`);

            // Find seller to send email
            const seller = sellers.find(s => s.id === id);
            if (seller) {
                // Determine email and name (adjust fields based on object structure)
                const email = seller.email;
                const name = seller.fullName || seller.shopName;
                if (email) {
                    await sendSellerApprovalEmail(email, name);
                }
            }

            setSellers(prev => prev.map(s => s.id === id ? { ...s, approved: true } : s));
            Swal.fire({ icon: 'success', title: 'Seller Approved!', timer: 1500, showConfirmButton: false });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Failed' });
        }
    };
    const handleBlock = async (id) => { try { await API.put(`/admin/sellers/${id}/block`); setSellers(prev => prev.map(s => s.id === id ? { ...s, blocked: true } : s)); Swal.fire({ icon: 'warning', title: 'Seller Blocked!', timer: 1500, showConfirmButton: false }); } catch (error) { Swal.fire({ icon: 'error', title: 'Failed' }); } };
    const handleUnblock = async (id) => { try { await API.put(`/admin/sellers/${id}/unblock`); setSellers(prev => prev.map(s => s.id === id ? { ...s, blocked: false } : s)); Swal.fire({ icon: 'success', title: 'Seller Unblocked!', timer: 1500, showConfirmButton: false }); } catch (error) { Swal.fire({ icon: 'error', title: 'Failed' }); } };
    const handleDeleteSeller = async (id) => { try { await API.delete(`/admin/sellers/${id}`); setSellers(prev => prev.filter(s => s.id !== id)); Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false }); } catch (error) { Swal.fire({ icon: 'error', title: 'Failed' }); } };

    const handleProductApprove = async (id) => { try { await API.put(`/admin/products/${id}/approve`); setProducts(current => current.map(p => p.id === id ? { ...p, approved: true } : p)); Swal.fire({ icon: 'success', title: 'Approved!', timer: 1500, showConfirmButton: false }); } catch (error) { } };
    const handleProductUnapprove = async (id) => { try { await API.put(`/admin/products/${id}/unapprove`); setProducts(current => current.map(p => p.id === id ? { ...p, approved: false } : p)); Swal.fire({ icon: 'success', title: 'Unapproved!', timer: 1500, showConfirmButton: false }); } catch (error) { } };
    const handleProductReject = async (id) => { try { await API.delete(`/admin/products/${id}/reject`); setProducts(current => current.filter(p => p.id !== id)); Swal.fire({ icon: 'success', title: 'Rejected!', timer: 1500, showConfirmButton: false }); } catch (error) { } };

    const handleAddFeature = async (e) => { e.preventDefault(); try { const res = await API.post('/features', { name: featName, description: featDesc }); setFeatures([...features, res.data]); setFeatName(''); setFeatDesc(''); Swal.fire({ icon: 'success', title: 'Added!', timer: 1500, showConfirmButton: false }); } catch (ERROR) { Swal.fire({ icon: 'error', title: 'Failed' }); } };

    // --- Theme Setup ---
    const { theme, toggleTheme } = useTheme();

    // --- Table Configurations ---
    const sellerColumns = [
        { field: 'fullName', headerName: 'Seller Name', flex: 1, minWidth: 150 },
        { field: 'shopName', headerName: 'Shop Name', width: 150 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Badge variant={params.row.approved ? (params.row.blocked ? 'danger' : 'success') : 'warning'}>
                    {params.row.approved ? (params.row.blocked ? 'Blocked' : 'Verified') : 'Pending'}
                </Badge>
            )
        },
        {
            field: 'actions',
            headerName: 'Action',
            width: 180,
            renderCell: (params) => (
                <div className="flex items-center gap-2 mt-2">
                    {!params.row.approved && <Button size="sm" variant="success" onClick={() => handleApprove(params.row.id)}><CheckCircle size={16} /></Button>}
                    {params.row.approved && params.row.blocked && <Button size="sm" variant="success" onClick={() => handleUnblock(params.row.id)}><CheckCircle size={16} /></Button>}
                    {(!params.row.blocked && params.row.approved) && <Button size="sm" variant="warning" onClick={() => handleBlock(params.row.id)}><AlertCircle size={16} /></Button>}
                    <Button size="sm" variant="danger" onClick={() => handleDeleteSeller(params.row.id)}><Trash2 size={16} /></Button>
                </div>
            )
        }
    ];

    const productColumns = [
        {
            field: 'product',
            headerName: 'Product',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-bg-band dark:bg-bg-dark">
                        {params.row.imageUrls?.[0] && <img className="h-full w-full object-cover" src={params.row.imageUrls[0]} alt="" />}
                    </div>
                    <span className="font-medium text-text-primary dark:text-text-onDark truncate" title={params.row.name}>{params.row.name}</span>
                </div>
            )
        },
        { field: 'category', headerName: 'Category', width: 150, valueGetter: (value, row) => row?.category?.name || 'Uncategorized' },
        { field: 'price', headerName: 'Price', width: 100, renderCell: (params) => `₹${params.value}` },
        {
            field: 'approved',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => {
                const isApproved = params.row.approved || params.row.isApproved;
                return <Badge variant={isApproved ? 'success' : 'warning'}>{isApproved ? 'Active' : 'Pending'}</Badge>;
            }
        },
        {
            field: 'actions',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => {
                const isApproved = params.row.approved || params.row.isApproved;
                return (
                    <div className="flex items-center gap-2 mt-2">
                        {!isApproved ? (
                            <>
                                <Button size="sm" variant="success" onClick={() => handleProductApprove(params.row.id)}><CheckCircle size={16} /></Button>
                                <Button size="sm" variant="danger" onClick={() => handleProductReject(params.row.id)}><XCircle size={16} /></Button>
                            </>
                        ) : (
                            <>
                                <Button size="sm" variant="warning" onClick={() => handleProductUnapprove(params.row.id)}><AlertCircle size={16} /></Button>
                                <Button size="sm" variant="ghost" onClick={() => handleProductReject(params.row.id)} className="text-status-error hover:bg-red-50"><Trash2 size={16} /></Button>
                            </>
                        )}
                    </div>
                );
            }
        }
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-bg-page dark:bg-bg-dark">
            {/* Admin Sidebar */}
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 flex flex-col h-screen relative">
                {/* Topbar */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-border dark:border-white/5 bg-bg-surface dark:bg-bg-dark flex-shrink-0">
                    <div className="flex-1 flex items-center">
                        {/* Search Bar */}
                        <div className="relative w-full max-w-md hidden md:block">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </span>
                            <input
                                className="w-full pl-10 pr-4 py-2 border border-border dark:border-white/10 rounded-lg text-sm bg-bg-page dark:bg-bg-surface/5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-text-onDark transition-colors placeholder-gray-400"
                                type="text"
                                placeholder="Search orders, sellers, or products..."
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} className="text-text-secondary hover:text-primary transition-colors">
                            {theme === 'dark' ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            )}
                        </button>
                        <button className="text-text-secondary hover:text-primary transition-colors relative">
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-bg-dark"></span>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                        {/* Profile */}
                        <div className="relative border-l border-border dark:border-white/10 pl-2">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 p-1 rounded-lg hover:bg-bg-page dark:hover:bg-white/5 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                                    {user?.name?.charAt(0) || 'S'}
                                </div>
                                <div className="hidden md:flex items-center gap-2">
                                    <div className="text-left">
                                        <p className="font-semibold text-text-primary dark:text-text-onDark leading-none">{user?.name || 'Surendra Sahu'}</p>
                                        <p className="text-[11px] text-text-secondary mt-0.5 leading-none">Super Admin</p>
                                    </div>
                                    <ChevronDown size={16} className={`text-text-secondary transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-48 bg-bg-surface dark:bg-bg-dark border border-border dark:border-white/10 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden z-50"
                                    >
                                        <div className="p-2 flex flex-col gap-1">
                                            <div className="px-3 py-2 border-b border-border dark:border-white/10 mb-1">
                                                <p className="text-sm font-semibold text-text-primary dark:text-text-onDark">{user?.name || 'Surendra Sahu'}</p>
                                                <p className="text-xs text-text-secondary mt-0.5">{user?.email || 'admin@example.com'}</p>
                                            </div>
                                            
                                            <button 
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    navigate('/profile');
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-onDark hover:bg-bg-page dark:hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <User size={16} className="text-text-secondary" />
                                                <span>My Profile</span>
                                            </button>

                                            <button 
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    setActiveTab('overview');
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-onDark hover:bg-bg-page dark:hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <LayoutDashboard size={16} className="text-text-secondary" />
                                                <span>Dashboard</span>
                                            </button>

                                            <button 
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    navigate('/settings');
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-onDark hover:bg-bg-page dark:hover:bg-white/5 rounded-lg transition-colors mb-1"
                                            >
                                                <Settings size={16} className="text-text-secondary" />
                                                <span>Settings</span>
                                            </button>

                                            <div className="h-px bg-border dark:bg-white/10 w-full my-1"></div>

                                            <button 
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-status-error hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <LogOut size={16} />
                                                <span>Log Out</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-text-primary dark:text-text-onDark capitalize">
                            {activeTab}
                        </h2>
                        <p className="text-text-secondary text-sm mt-1">Manage your platform efficiently.</p>
                    </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard title="Total Sellers" value={sellers.length} icon={Users} color="blue" trend="up" trendValue={5} />
                            <StatsCard title="Total Products" value={products.length} icon={Package} color="purple" trend="up" trendValue={12} />
                            <StatsCard title="Active Coupons" value={coupons.filter(c => c.isActive).length} icon={Ticket} color="pink" trend="neutral" />
                            <StatsCard title="Active Orders" value={156} icon={ShoppingBag} color="green" trend="up" trendValue={8} /> {/* Mock value for orders */}
                        </div>

                        {/* Analytics Component */}
                        <AnalyticsDashboard />
                    </motion.div>
                )}

                {activeTab === 'sellers' && (
                    <motion.div key="sellers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Card title="Sellers Management">
                            <div style={{ height: 600, width: '100%' }}>
                                <DataGrid
                                    rows={sellers}
                                    columns={sellerColumns}
                                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                                    pageSizeOptions={[5, 10]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                />
                            </div>
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'products' && (
                    <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Card title="Product Management">
                            <div style={{ height: 600, width: '100%' }}>
                                <DataGrid
                                    rows={products}
                                    columns={productColumns}
                                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                                    pageSizeOptions={[5, 10]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                />
                            </div>
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'categories' && (
                    <motion.div key="categories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <AdminCategories />
                    </motion.div>
                )}

                {activeTab === 'coupons' && (
                    <motion.div key="coupons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Card title="Coupon Management">
                            <AdminCouponList />
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'returns' && (
                    <motion.div key="returns" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Card title="Return Requests Management">
                            <AdminReturnManagement />
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'features' && (
                    <motion.div key="features" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <Card title="Add Feature">
                                    <form onSubmit={handleAddFeature} className="space-y-4">
                                        <Input label="Name" value={featName} onChange={(e) => setFeatName(e.target.value)} placeholder="e.g. Handwoven" required />
                                        <Input 
                                            label="Description" 
                                            multiline 
                                            rows="4" 
                                            value={featDesc} 
                                            onChange={(e) => setFeatDesc(e.target.value)} 
                                            placeholder="Description..." 
                                        />
                                        <Button type="submit" className="w-full">Add Feature</Button>
                                    </form>
                                </Card>
                            </div>
                            <div className="md:col-span-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {features.map((f, idx) => (
                                        <Card key={idx} className="hover:shadow-lg transition-shadow border-l-4 border-l-secondary">
                                            <h4 className="font-bold text-lg text-dark dark:text-text-onDark">{f.name}</h4>
                                            <p className="text-muted text-sm mt-1 line-clamp-2">{f.description || "No description"}</p>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
