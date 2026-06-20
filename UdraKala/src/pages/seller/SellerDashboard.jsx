import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getSellerReturns, processReturnRequest } from '../../api/returnApi';
import {
    Plus,
    Package,
    DollarSign,
    ShoppingBag,
    Loader2,
    Pencil,
    Trash2,
    CheckCircle,
    XCircle,
    X,
    Truck,
    AlertTriangle,
    RotateCcw,
    TrendingUp,
    UploadCloud,
    LayoutDashboard,
    BarChart2,
    FileText,
    Wallet,
    Film,
    User,
    Search,
    Bell,
    Sun,
    Moon,
    Menu,
    LogOut,
    Settings,
    ChevronDown,
    MoreVertical,
    Eye,
    Copy,
    Archive
} from 'lucide-react';
import udraKalaLogo from '../../assets/logo.jpg';
import MuiMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import Swal from 'sweetalert2';
import API from '../../api/api';
import { sendReturnUpdateEmail, sendStatusUpdateEmail } from '../../utils/emailService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import SellerReelsDashboard from './SellerReelsDashboard';
import SellerAnalyticsDashboard from './SellerAnalyticsDashboard';

import SellerProfileView from './SellerProfileView';
import SellerOrders from './SellerOrders';
import SellerWallet from './SellerWallet';
import ManifestView from './ManifestView';
import DashboardSkeleton from '../../components/skeletons/DashboardSkeleton';
import AiAssistButton from '../../components/AiAssistButton';
import NotificationBell from '../../components/NotificationBell';
import { generateProductDescription } from '../../api/aiApi';

// -- TailAdmin Style Header --
const SellerHeader = ({ user, theme, toggleTheme, logout }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-40 flex w-full bg-bg-surface dark:bg-bg-dark shadow-sm">
            <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    <button className="z-50 block rounded-sm border border-stroke bg-bg-surface p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden">
                        <Menu size={20} />
                    </button>
                    {/* Logo for mobile */}
                    <img src={udraKalaLogo} className="h-8 w-8 rounded-full" alt="Logo" />
                </div>

                <div className="hidden sm:block flex-1">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary" size={20} />
                        <input
                            type="text"
                            placeholder="Search or type command..."
                            className="w-full bg-transparent pl-12 pr-4 py-2 focus:outline-none text-text-primary dark:text-text-secondary"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
                            <span className="text-xs text-text-secondary bg-bg-band dark:bg-bg-dark px-2 py-1 rounded">⌘K</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 2xsm:gap-7 ml-auto">
                    <ul className="flex items-center gap-2 2xsm:gap-4">
                        <li>
                            <button
                                onClick={toggleTheme}
                                className="flex items-center justify-center h-10 w-10 rounded-full bg-bg-band dark:bg-bg-dark text-text-secondary dark:text-text-secondary hover:text-primary transition-colors"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                        </li>
                        <li>
                            <NotificationBell />
                        </li>
                    </ul>

                    {/* User Area */}
                    <div className="relative group" ref={userMenuRef}>
                        <button 
                            className="flex items-center gap-4 focus:outline-none"
                            onClick={() => setIsUserMenuOpen(prev => !prev)}
                        >
                            <span className="hidden text-right lg:block">
                                <span className="block text-sm font-medium text-black dark:text-text-onDark">
                                    {user?.name || user?.fullName || 'Seller'}
                                </span>
                                <span className="block text-xs font-medium text-text-secondary">Seller</span>
                            </span>
                            <span className="h-10 w-10 rounded-full border border-border dark:border-border overflow-hidden">
                                {user?.profileImage ? (
                                    <img src={user.profileImage} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary text-text-onDark flex items-center justify-center font-bold">
                                        {(user?.name || user?.fullName || 'S').charAt(0)}
                                    </div>
                                )}
                            </span>
                            <ChevronDown className={`hidden sm:block text-text-secondary dark:text-text-secondary transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} size={16} />
                        </button>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <Motion.div 
                                    key="seller-user-menu"
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-3 w-56 bg-bg-surface dark:bg-bg-dark border border-border dark:border-border rounded-xl shadow-xl origin-top-right z-50 overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-border dark:border-border bg-bg-page dark:bg-bg-dark/50">
                                        <span className="block text-sm text-text-primary dark:text-text-onDark font-bold truncate">{user?.fullName || user?.name || "Profile"}</span>
                                        <span className="block text-xs text-text-secondary truncate dark:text-text-secondary mt-1">{user?.email || "seller@example.com"}</span>
                                    </div>
                                    <div className="py-2">
                                        <button onClick={() => { setIsUserMenuOpen(false); navigate('/seller/profile'); }} className="flex items-center px-4 py-2.5 text-sm w-full text-text-secondary dark:text-text-secondary hover:bg-bg-band dark:hover:bg-bg-dark transition-colors">
                                            <User size={18} className="mr-3 opacity-80" />
                                            <span className="font-medium">My Profile</span>
                                        </button>
                                        <button onClick={() => { setIsUserMenuOpen(false); navigate('/seller/settings'); }} className="flex items-center px-4 py-2.5 text-sm w-full text-text-secondary dark:text-text-secondary hover:bg-bg-band dark:hover:bg-bg-dark transition-colors">
                                            <Settings size={18} className="mr-3 opacity-80" />
                                            <span className="font-medium">Settings</span>
                                        </button>
                                    </div>
                                    <div className="p-2 border-t border-border dark:border-border">
                                        <button 
                                            onClick={() => { setIsUserMenuOpen(false); logout(); }} 
                                            className="flex items-center px-4 py-2.5 text-sm w-full text-status-error dark:text-red-400 hover:bg-red-50 dark:hover:text-status-error/20 rounded-lg transition-colors"
                                        >
                                            <LogOut size={18} className="mr-3 opacity-80" />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                </Motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

const ProductActionMenu = ({ product, handleEdit, handleDelete }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton onClick={handleClick} size="small" className="text-text-secondary hover:text-text-secondary">
                <MoreVertical size={20} />
            </IconButton>
            <MuiMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 3,
                    sx: { minWidth: 200, borderRadius: '12px', mt: 0.5, p: 1, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => { handleClose(); }} sx={{ py: 1.5, borderRadius: '8px', mb: 0.5 }}>
                    <Eye size={18} className="mr-3 text-primary" />
                    <span className="text-sm font-medium text-text-secondary">View Live Page</span>
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); handleEdit(product); }} sx={{ py: 1.5, borderRadius: '8px', mb: 0.5 }}>
                    <Pencil size={18} className="mr-3 text-primary" />
                    <span className="text-sm font-medium text-text-secondary">Edit Details</span>
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); }} sx={{ py: 1.5, borderRadius: '8px', mb: 0.5 }}>
                    <Copy size={18} className="mr-3 text-primary" />
                    <span className="text-sm font-medium text-text-secondary">Duplicate</span>
                </MenuItem>
                
                <div className="h-px bg-bg-band my-2 mx-2"></div>
                
                <MenuItem onClick={() => { handleClose(); }} sx={{ py: 1.5, borderRadius: '8px', mb: 0.5 }}>
                    <Archive size={18} className="mr-3 text-status-warning" />
                    <span className="text-sm font-medium text-status-warning">Archive Product</span>
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); handleDelete(product.id); }} sx={{ py: 1.5, borderRadius: '8px' }}>
                    <Trash2 size={18} className="mr-3 text-status-error" />
                    <span className="text-sm font-medium text-status-error">Delete Product</span>
                </MenuItem>
            </MuiMenu>
        </>
    );
};

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
    <Card className="flex items-center gap-4 relative overflow-hidden">
        <div className={`p-3 rounded-full ${colorClass} bg-opacity-10 text-text-onDark`}>
            {Icon && <Icon size={24} className={colorClass.replace('bg-', 'text-')} />}
        </div>
        <div>
            <p className="text-sm text-text-secondary dark:text-text-secondary">{label}</p>
            <h3 className="text-2xl font-bold text-text-primary dark:text-text-onDark">{value}</h3>
        </div>
    </Card>
);

const SellerDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    // Context only provides these:
    const { addProduct, categories } = useData();

    // Local State for Seller Data
    const [myProducts, setMyProducts] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [myReturns, setMyReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Create MUI Theme based on current app theme
    const muiTheme = useMemo(() => createTheme({
        palette: {
            mode: theme === 'dark' ? 'dark' : 'light',
            primary: {
                main: '#2563eb', // Blue-600
            },
            background: {
                paper: theme === 'dark' ? '#1f2937' : '#ffffff', // Tailwind gray-800
                default: theme === 'dark' ? '#111827' : '#ffffff',
            },
            text: {
                primary: theme === 'dark' ? '#f3f4f6' : '#111827', // gray-100 vs gray-900
                secondary: theme === 'dark' ? '#9ca3af' : '#4b5563',
            },
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none', // Remove elevation overlay in dark mode
                    },
                },
            },
        },
    }), [theme]);

    const [activeTab, setActiveTab] = useState('overview');

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Handle initial tab from navigation state
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Reset filters on tab change
    useEffect(() => {
        setSearchTerm('');
        setStatusFilter('ALL');
    }, [activeTab]);

    // Helper to get filtered data
    const getFilteredData = () => {
        let data = [];
        const lowerSearch = searchTerm.toLowerCase();

        if (activeTab === 'products') {
            data = myProducts.filter(p =>
                (p.name?.toLowerCase() || '').includes(lowerSearch) &&
                (statusFilter === 'ALL' || p.category?.name === statusFilter)
            );
        } else if (activeTab === 'orders') {
            data = myOrders.filter(o =>
                ((o.id?.toLowerCase() || '').includes(lowerSearch) ||
                    (o.user?.name?.toLowerCase() || '').includes(lowerSearch)) &&
                (statusFilter === 'ALL' || o.status === statusFilter)
            );
        } else if (activeTab === 'returns') {
            data = myReturns.filter(r =>
                (r.customer?.name?.toLowerCase() || '').includes(lowerSearch) &&
                (statusFilter === 'ALL' || r.status === statusFilter)
            );
        }
        return data;
    };

    const filteredData = getFilteredData();
    const paginationModel = { page: 0, pageSize: 5 };



    // Initial Data Fetch
    const fetchData = async () => {
        try {
            setLoading(true);
            const results = await Promise.allSettled([
                API.get('/seller/products'),
                API.get('/orders/seller-orders'),
                getSellerReturns()
            ]);

            // Handle Products
            if (results[0].status === 'fulfilled') {
                setMyProducts(Array.isArray(results[0].value.data) ? results[0].value.data : []);
            } else {
                console.error("Failed to fetch products:", results[0].reason);
                // Swal.fire('Error', 'Could not load products', 'error');
            }

            // Handle Orders
            if (results[1].status === 'fulfilled') {
                setMyOrders(Array.isArray(results[1].value.data) ? results[1].value.data : []);
            } else {
                console.error("Failed to fetch orders:", results[1].reason);
            }

            // Handle Returns
            if (results[2].status === 'fulfilled') {
                setMyReturns(Array.isArray(results[2].value) ? results[2].value : []);
            } else {
                console.error("Failed to fetch returns:", results[2].reason);
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // checkNewNotifications removed to prevent duplicate/annoying alerts
    }, []);

    // Derived Stats
    const stats = useMemo(() => {
        const totalRevenue = myOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const totalOrders = myOrders.length;
        const totalProducts = myProducts.length;
        const pendingOrders = myOrders.filter(o => o.status === 'PENDING').length;

        return { totalRevenue, totalOrders, totalProducts, pendingOrders };
    }, [myOrders, myProducts]);

    // Weekly Data for Chart (Mocking slightly if no real date data, but trying to parse)
    const weeklyData = useMemo(() => {
        // Group by day (simplified)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const data = days.map(day => ({ name: day, sales: 0, orders: 0 }));

        myOrders.forEach(order => {
            if (order.createdAt) {
                const date = new Date(order.createdAt);
                const dayIndex = date.getDay();
                data[dayIndex].sales += (order.totalAmount || 0);
                data[dayIndex].orders += 1;
            }
        });
        return data;
    }, [myOrders]);



    const handleDeleteProduct = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await API.delete(`/seller/products/${id}`);
                Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
                fetchData();
            } catch (error) {
                const msg = error.response?.data?.message || 'Failed to delete product';
                Swal.fire('Error', msg, 'error');
            }
        }
    };

    const handleEditProduct = (product) => {
        navigate(`/seller/products/edit/${product.id}`);
    };




    const openAddModal = () => {
        setEditingProduct(null);
        setProductForm({
            name: '',
            description: '',
            price: '',
            stockQuantity: '',
            categoryName: categories[0]?.name || '',
            imageUrl: '',
            material: '',
            color: '',
            size: '',
            origin: '',
            packOf: ''
        });
        setSelectedFiles([]);
        setReelFile(null);
        setSelectedMainId('');
        setSelectedGroupId('');
        setSelectedSubId('');
        setShowModal(true);
    };

    // Order Handlers
    const handleOrderStatus = async (orderId, newStatus) => {
        try {
            await API.put(`/orders/${orderId}/status`, { status: newStatus });

            // Send Email
            const order = myOrders.find(o => o.id === orderId);
            if (order && order.user && order.user.email) {
                await sendStatusUpdateEmail(
                    order.user.email,
                    order.user.fullName || order.user.name,
                    orderId,
                    newStatus,
                    '', // Courier info not captured in this quick action
                    ''  // Tracking info not captured
                );
            }

            Swal.fire('Updated', `Order marked as ${newStatus}`, 'success');
            fetchData();
        } catch (error) {
            Swal.fire('Error', 'Failed to update order status', 'error');
        }
    };

    // Return Actions
    const handleReturnAction = async (id, action) => {
        const { value: remarks } = await Swal.fire({
            title: `${action === 'APPROVED' ? 'Approve' : 'Reject'} Return?`,
            input: 'text',
            inputLabel: 'Remarks',
            inputPlaceholder: 'Enter remarks...',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            confirmButtonColor: action === 'APPROVED' ? '#10b981' : '#ef4444'
        });

        if (remarks !== undefined) {
            try {
                await processReturnRequest(id, action, remarks);

                // Send Email Notification
                const returnReq = myReturns.find(r => r.id === id);
                if (returnReq && returnReq.customer && returnReq.customer.email) {
                    await sendReturnUpdateEmail(
                        returnReq.customer.email,
                        returnReq.customer.name || returnReq.customer.fullName,
                        returnReq.orderItem?.order?.id || 'N/A',
                        action,
                        remarks
                    );
                }

                Swal.fire('Success', `Return request marked as ${action}`, 'success');
                const data = await getSellerReturns();
                setMyReturns(data);
            } catch (error) {
                Swal.fire('Error', 'Failed to update return status', 'error');
            }
        }
    };

    // DataGrid Columns Configuration
    const productColumns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        {
            field: 'image',
            headerName: 'Image',
            width: 80,
            renderCell: (params) => (
                <img
                    src={params.row.images?.[0]?.imagePath || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjwvc3ZnPg=='}
                    alt={params.row.name}
                    className="w-10 h-10 rounded object-cover"
                />
            ),
        },
        { field: 'name', headerName: 'Product Name', flex: 1, minWidth: 200 },
        { field: 'price', headerName: 'Price', width: 100, renderCell: (params) => `₹${params.value}` },
        {
            field: 'stockQuantity',
            headerName: 'Stock',
            width: 100,
            renderCell: (params) => (
                <span className={`px-2 py-1 rounded text-xs ${params.value < 10 ? 'text-status-error text-status-error' : 'bg-green-100 text-green-700'}`}>
                    {params.value}
                </span>
            ),
        },
        { field: 'category', headerName: 'Category', width: 150, valueGetter: (value, row) => row.category?.name || 'N/A' },
        {
            field: 'actions',
            headerName: '',
            width: 80,
            sortable: false,
            filterable: false,
            align: 'center',
            renderCell: (params) => (
                <ProductActionMenu 
                    product={params.row} 
                    handleEdit={handleEditProduct} 
                    handleDelete={handleDeleteProduct} 
                />
            ),
        },
    ];

    const orderColumns = [
        { field: 'id', headerName: 'Order ID', width: 100, valueGetter: (value, row) => `#${row.id.substring(0, 8)}` },
        { field: 'customer', headerName: 'Customer', width: 150, valueGetter: (value, row) => row.user?.name || 'Customer' },
        {
            field: 'items',
            headerName: 'Items',
            flex: 1,
            minWidth: 250,
            renderCell: (params) => (
                <div className="text-xs">
                    {params.row.orderItems?.map(i => (
                        <div key={i.id} className="truncate">{i.product.name} (x{i.quantity})</div>
                    ))}
                </div>
            ),
        },
        { field: 'totalAmount', headerName: 'Total', width: 100, renderCell: (params) => `₹${params.value}` },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Badge variant={params.value === 'DELIVERED' ? 'success' : 'warning'}>{params.value}</Badge>
            ),
        },
        {
            field: 'actions',
            headerName: 'Update Status',
            width: 180,
            renderCell: (params) => (
                params.row.status !== 'DELIVERED' && params.row.status !== 'CANCELLED' && (
                    <select
                        className="text-xs p-1 border rounded bg-bg-surface dark:bg-bg-dark dark:text-text-onDark mt-2"
                        onChange={(e) => handleOrderStatus(params.row.id, e.target.value)}
                        value={params.row.status}
                        onClick={(e) => e.stopPropagation()} // Prevent row click
                    >
                        <option value="PENDING">Pending</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                    </select>
                )
            ),
        },
    ];

    const returnColumns = [
        {
            field: 'item',
            headerName: 'Item',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <div className="flex items-center gap-2">
                    <img
                        src={params.row.orderItem?.product?.images?.[0]?.imagePath || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjwvc3ZnPg=='}
                        className="w-8 h-8 rounded"
                        alt=""
                    />
                    <div className="overflow-hidden">
                        <p className="text-xs truncate">{params.row.orderItem?.product?.name}</p>
                    </div>
                </div>
            )
        },
        { field: 'customer', headerName: 'Customer', width: 150, valueGetter: (value, row) => row.customer?.name || 'Unknown' },
        { field: 'reason', headerName: 'Reason', width: 150 },
        { field: 'type', headerName: 'Type', width: 100 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Badge variant={params.row.status === 'APPROVED' ? 'success' : params.row.status === 'REJECTED' ? 'danger' : 'warning'}>
                    {params.row.status}
                </Badge>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <div className="flex gap-2 mt-2">
                    {params.row.status === 'PENDING' && (
                        <>
                            <Button size="sm" variant="success" onClick={() => handleReturnAction(params.row.id, 'APPROVED')}><CheckCircle size={14} /></Button>
                            <Button size="sm" variant="danger" onClick={() => handleReturnAction(params.row.id, 'REJECTED')}><XCircle size={14} /></Button>
                        </>
                    )}
                    {params.row.status === 'APPROVED' && (
                        <Button size="sm" variant="primary" onClick={() => handleReturnAction(params.row.id, 'PICKUP_INITIATED')}>Initiate Pickup</Button>
                    )}
                    {params.row.status === 'PICKUP_INITIATED' && (
                        <Button size="sm" variant="success" onClick={() => handleReturnAction(params.row.id, 'PASS_CHECK')}>Complete</Button>
                    )}
                </div>
            )
        },
    ];

    const sidebarTabs = [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'manifest', label: 'Manifest', icon: FileText },
        { id: 'returns', label: 'Returns', icon: RotateCcw },
        { id: 'wallet', label: 'Wallet', icon: Wallet },
        { id: 'reels', label: 'Reels', icon: Film },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-bg-page dark:bg-bg-dark font-sans text-text-primary dark:text-text-secondary">
            {/* Sidebar Navigation */}
            <aside className="absolute left-0 top-0 z-50 flex h-screen w-64 flex-col overflow-y-hidden bg-bg-surface dark:bg-bg-dark border-r border-border dark:border-border shadow-sm hidden md:flex">
                {/* Sidebar Header */}
                <div className="flex items-center gap-3 px-6 py-5.5 lg:py-6.5 mt-4 mb-4">
                    <img src={udraKalaLogo} className="h-10 w-10 rounded-full" alt="UdraKala Logo" />
                    <h1 className="text-2xl font-bold text-text-primary dark:text-text-onDark tracking-tight">TailAdmin</h1>
                </div>

                {/* Sidebar Menu */}
                <div className="no-scrollbar flex flex-col flex-1 overflow-y-auto duration-300 ease-linear">
                    <nav className="mt-2 py-4 px-4 lg:mt-4 lg:px-6">
                        <div>
                            <h3 className="mb-4 ml-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Menu</h3>
                            <ul className="mb-6 flex flex-col gap-1.5">
                                {sidebarTabs.map(tab => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                                        ${isActive
                                                    ? 'bg-primary text-text-onDark shadow-md shadow-primary/20 scale-[1.02]'
                                                    : 'text-text-secondary dark:text-text-secondary hover:bg-bg-band dark:hover:bg-bg-dark hover:text-text-primary dark:hover:text-text-onDark'
                                                }`}
                                        >
                                            <Icon size={20} className={isActive ? 'text-text-onDark' : 'text-text-secondary dark:text-text-secondary'} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </ul>
                        </div>
                    </nav>
                </div>

                {/* Sidebar Bottom (Logout) */}
                <div className="p-4 border-t border-border dark:border-border">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-status-error dark:text-red-400 hover:bg-red-50 dark:hover:text-status-error/20 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden md:ml-64">
                {/* TailAdmin Header */}
                <SellerHeader user={user} theme={theme} toggleTheme={toggleTheme} logout={logout} />

                <main>
                    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                        {/* Dynamic Header */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
                            <h2 className="text-title-md2 font-semibold text-black dark:text-text-onDark text-2xl capitalize">
                                {activeTab}
                            </h2>
                            <nav>
                                <ol className="flex items-center gap-2 text-sm">
                                    <li>
                                        <span className="font-medium">Dashboard /</span>
                                    </li>
                                    <li className="font-medium text-primary capitalize">{activeTab}</li>
                                </ol>
                            </nav>
                        </div>

                    {loading ? (
                        <DashboardSkeleton />
                    ) : (
                        <>
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <StatCard label="Total Revenue" value={`₹${stats.totalRevenue}`} icon={DollarSign} colorClass="bg-status-success" />
                                        <StatCard label="Total Orders" value={stats.totalOrders} icon={ShoppingBag} colorClass="bg-primary" />
                                        <StatCard label="My Products" value={stats.totalProducts} icon={Package} colorClass="bg-purple-500" />
                                        <StatCard label="Pending Orders" value={stats.pendingOrders} icon={AlertTriangle} colorClass="bg-status-warning" />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card title="Revenue Growth">
                                            <div className="h-64 w-full min-w-0" style={{ minHeight: '250px' }}>
                                                {weeklyData && weeklyData.length > 0 ? (
                                                    <ResponsiveContainer width="100%" height={250}>
                                                        <AreaChart data={weeklyData}>
                                                            <defs>
                                                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                                                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                            <YAxis axisLine={false} tickLine={false} />
                                                            <Tooltip />
                                                            <Area type="monotone" dataKey="sales" stroke="#4F46E5" fillOpacity={1} fill="url(#colorSales)" />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-text-secondary">No Data Available</div>
                                                )}
                                            </div>
                                        </Card>
                                        <Card title="Order Volume">
                                            <div className="h-64 w-full min-w-0" style={{ minHeight: '250px' }}>
                                                {weeklyData && weeklyData.length > 0 ? (
                                                    <ResponsiveContainer width="100%" height={250}>
                                                        <BarChart data={weeklyData}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                            <YAxis axisLine={false} tickLine={false} />
                                                            <Tooltip />
                                                            <Bar dataKey="orders" fill="#10B981" radius={[4, 4, 0, 0]} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-text-secondary">No Data Available</div>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {/* Analytics Tab */}
                            {activeTab === 'analytics' && (
                                <SellerAnalyticsDashboard />
                            )}

                            {/* Products Tab */}
                            {activeTab === 'products' && (
                                <Card title="My Products">
                                    {/* Filter Bar */}
                                    <div className="flex gap-4 mb-4">
                                        <Input
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="max-w-xs"
                                        />
                                        <select
                                            className="rounded-md border border-border dark:border-border bg-bg-surface dark:bg-bg-dark px-3 py-2"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        >
                                            <option value="ALL">All Categories</option>
                                            {[...new Set(myProducts.map(p => p.category?.name))].filter(Boolean).map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>

                                        <div className="ml-auto">
                                            <Button onClick={() => navigate('/seller/products/create')} variant="primary">
                                                <Plus size={18} className="mr-2" /> Add Product
                                            </Button>
                                        </div>
                                    </div>

                                    <MuiThemeProvider theme={muiTheme}>
                                        <Paper sx={{ width: '100%', height: 500, boxShadow: 'none' }}>
                                            <DataGrid
                                                rows={filteredData}
                                                columns={productColumns}
                                                initialState={{ pagination: { paginationModel } }}
                                                pageSizeOptions={[5, 10]}
                                                checkboxSelection
                                                disableRowSelectionOnClick
                                            />
                                        </Paper>
                                    </MuiThemeProvider>
                                </Card>
                            )}

                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <SellerOrders />
                            )}

                            {/* Manifest Tab */}
                            {activeTab === 'manifest' && (
                                <ManifestView />
                            )}

                            {/* Wallet Tab */}
                            {activeTab === 'wallet' && (
                                <SellerWallet />
                            )}


                            {/* Returns Tab */}
                            {activeTab === 'returns' && (
                                <Card title="Return Requests">
                                    {/* Filter Bar */}
                                    <div className="flex gap-4 mb-4">
                                        <Input
                                            placeholder="Search by Customer..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="max-w-xs"
                                        />
                                        <select
                                            className="rounded-md border border-border dark:border-border bg-bg-surface dark:bg-bg-dark px-3 py-2"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        >
                                            <option value="ALL">All Status</option>
                                            <option value="PENDING">Pending</option>
                                            <option value="APPROVED">Approved</option>
                                            <option value="REJECTED">Rejected</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>


                                    <MuiThemeProvider theme={muiTheme}>
                                        <Paper sx={{ width: '100%', height: 500, boxShadow: 'none' }}>
                                            <DataGrid
                                                rows={filteredData}
                                                columns={returnColumns}
                                                initialState={{ pagination: { paginationModel } }}
                                                pageSizeOptions={[5, 10]}
                                                checkboxSelection
                                                disableRowSelectionOnClick
                                            />
                                        </Paper>
                                    </MuiThemeProvider>
                                </Card>
                            )}

                            {/* Reels Tab */}
                            {activeTab === 'reels' && (
                                <SellerReelsDashboard />
                            )}

                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <Card className="p-0 overflow-hidden border-none shadow-none bg-transparent">
                                    <SellerProfileView />
                                </Card>
                            )}
                        </>
                    )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SellerDashboard;
