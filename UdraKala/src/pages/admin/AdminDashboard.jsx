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
    Layers
} from 'lucide-react';
import API from '../../api/api';
import Swal from 'sweetalert2';
import { sendSellerApprovalEmail } from '../../utils/emailService';
import AnalyticsDashboard from './AnalyticsDashboard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import StatsCard from '../../components/admin/StatsCard';
import ScrollReveal from '../../components/ui/ScrollReveal';
import { getUnreadNotificationCount } from '../../api/adminNotificationApi';
import AdminCategories from './AdminCategories';
import AdminReturnManagement from './AdminReturnManagement';
import { useTheme } from '../../context/ThemeContext';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const AdminDashboard = () => {
    // Local state for admin data
    const [products, setProducts] = useState([]);
    const [sellers, setSellers] = useState([]);

    // Categories now handled by AdminCategories component

    const [features, setFeatures] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

    // Check for alerts on mount
    useEffect(() => {
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
    }, [navigate]);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const prodRes = await API.get('/admin/products');
                setProducts(prodRes.data || []);
                const sellerRes = await API.get('/admin/sellers');
                setSellers(sellerRes.data || []);

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
    const { theme } = useTheme();
    const muiTheme = useMemo(() => createTheme({
        palette: {
            mode: theme === 'dark' ? 'dark' : 'light',
            primary: { main: '#ea580c' },
            background: {
                paper: theme === 'dark' ? '#1f2937' : '#ffffff',
                default: theme === 'dark' ? '#111827' : '#ffffff',
            },
            text: {
                primary: theme === 'dark' ? '#f3f4f6' : '#111827',
                secondary: theme === 'dark' ? '#9ca3af' : '#4b5563',
            },
        },
        components: {
            MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        border: 'none',
                        '& .MuiDataGrid-cell': { borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' },
                        '& .MuiDataGrid-columnHeaders': {
                            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                            backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
                        },
                        '& .MuiDataGrid-footerContainer': { borderTopColor: theme === 'dark' ? '#374151' : '#e5e7eb' },
                    },
                },
            },
        },
    }), [theme]);

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
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {params.row.imageUrls?.[0] && <img className="h-full w-full object-cover" src={params.row.imageUrls[0]} alt="" />}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white truncate" title={params.row.name}>{params.row.name}</span>
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
                                <Button size="sm" variant="ghost" onClick={() => handleProductReject(params.row.id)} className="text-red-500 hover:bg-red-50"><Trash2 size={16} /></Button>
                            </>
                        )}
                    </div>
                );
            }
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif">Admin Dashboard</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your platform efficiently.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
                    {['overview', 'sellers', 'products', 'categories', 'returns', 'features'].map(tab => (
                        <motion.button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap
                                ${activeTab === tab
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {tab}
                        </motion.button>
                    ))}
                </div>
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
                            <StatsCard title="Categories" value="--" icon={Layers} color="orange" />
                            <StatsCard title="Active Orders" value={156} icon={ShoppingBag} color="green" trend="up" trendValue={8} /> {/* Mock value for orders */}
                        </div>

                        {/* Analytics Component */}
                        <AnalyticsDashboard />
                    </motion.div>
                )}

                {activeTab === 'sellers' && (
                    <motion.div key="sellers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Card title="Sellers Management">
                            <MuiThemeProvider theme={muiTheme}>
                                <Paper sx={{ width: '100%', height: 600, boxShadow: 'none' }}>
                                    <DataGrid
                                        rows={sellers}
                                        columns={sellerColumns}
                                        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                                        pageSizeOptions={[5, 10]}
                                        checkboxSelection
                                        disableRowSelectionOnClick
                                    />
                                </Paper>
                            </MuiThemeProvider>
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'products' && (
                    <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Card title="Product Management">
                            <MuiThemeProvider theme={muiTheme}>
                                <Paper sx={{ width: '100%', height: 600, boxShadow: 'none' }}>
                                    <DataGrid
                                        rows={products}
                                        columns={productColumns}
                                        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                                        pageSizeOptions={[5, 10]}
                                        checkboxSelection
                                        disableRowSelectionOnClick
                                    />
                                </Paper>
                            </MuiThemeProvider>
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'categories' && (
                    <motion.div key="categories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <AdminCategories />
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
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-dark dark:text-white">Description</label>
                                            <textarea value={featDesc} onChange={(e) => setFeatDesc(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-dark border border-border dark:border-muted rounded-md text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" rows="4" placeholder="Description..." />
                                        </div>
                                        <Button type="submit" className="w-full">Add Feature</Button>
                                    </form>
                                </Card>
                            </div>
                            <div className="md:col-span-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {features.map((f, idx) => (
                                        <Card key={idx} className="hover:shadow-lg transition-shadow border-l-4 border-l-secondary">
                                            <h4 className="font-bold text-lg text-dark dark:text-white">{f.name}</h4>
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
    );
};

export default AdminDashboard;
