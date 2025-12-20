import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { motion as Motion } from 'motion/react';
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
    UploadCloud
} from 'lucide-react';
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


const StatCard = ({ label, value, icon: Icon, colorClass }) => (
    <Card className="flex items-center gap-4 relative overflow-hidden">
        <div className={`p-3 rounded-full ${colorClass} bg-opacity-10 text-white`}>
            {Icon && <Icon size={24} className={colorClass.replace('bg-', 'text-')} />}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
    </Card>
);

const SellerDashboard = () => {
    const { theme } = useTheme();
    const { user } = useAuth();

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
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        border: 'none',
                        '& .MuiDataGrid-cell': {
                            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                            backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTopColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                        },
                    },
                },
            },
        },
    }), [theme]);

    const [activeTab, setActiveTab] = useState('overview');

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

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

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        categoryName: '',
        imageUrl: '',
        material: '',
        color: '',
        size: '',
        origin: '',
        packOf: ''
    });
    const [selectedFiles, setSelectedFiles] = useState([]);

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

    // Product Handlers
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                // For edit, we might need a different approach if backend supports image update 
                // but checking the Controller, updateProduct (PUT) only takes RequestBody ProductRequest.
                // So image update might be missing in backend or require a different endpoint.
                // For now, simpler to just support image upload on CREATE.

                // If backend PUT /products/{id} supports only JSON, we can't upload new images via this specific call unless updated.
                // Looking at Controller: @PutMapping("/products/{id}") takes @RequestBody ProductRequest.
                // So NO image update support there. 
                // I will proceed with standard JSON update for now, focusing on ADD (POST) for images.

                const category = categories.find(c => c.name === productForm.categoryName);
                if (!category) {
                    Swal.fire('Error', 'Invalid Category', 'error');
                    return;
                }

                const payload = {
                    ...productForm,
                    categoryId: category.id
                };

                await API.put(`/seller/products/${editingProduct.id}`, payload);
                Swal.fire('Success', 'Product updated successfully', 'success');
            } else {
                // Add New Product with Images
                const category = categories.find(c => c.name === productForm.categoryName);
                if (!category) {
                    Swal.fire('Error', 'Invalid Category', 'error');
                    return;
                }

                // Image Validation
                if (selectedFiles.length < 1) {
                    Swal.fire('Error', 'Please upload at least 1 product image.', 'warning');
                    return;
                }
                if (selectedFiles.length > 8) {
                    Swal.fire('Error', 'You can upload a maximum of 8 images.', 'warning');
                    return;
                }

                const formData = new FormData();
                const productBlob = new Blob([JSON.stringify({
                    name: productForm.name,
                    description: productForm.description,
                    price: productForm.price,
                    stockQuantity: productForm.stockQuantity,
                    categoryId: category.id,
                    discountPrice: 0, // Default or add field
                    material: productForm.material,
                    color: productForm.color,
                    size: productForm.size,
                    origin: productForm.origin,
                    packOf: productForm.packOf
                })], { type: "application/json" });

                formData.append("product", productBlob);

                if (selectedFiles.length > 0) {
                    selectedFiles.forEach(file => {
                        formData.append("images", file);
                    });
                }

                await addProduct(formData);
                Swal.fire('Success', 'Product added successfully', 'success');
            }
            setShowModal(false);
            setSelectedFiles([]); // Reset files
            fetchData();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to save product', 'error');
        }
    };

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

    const openEditModal = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            description: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity,
            categoryName: product.category?.name || '',
            imageUrl: product.imageUrls?.[0] || '',
            material: product.material || '',
            color: product.color || '',
            size: product.size || '',
            origin: product.origin || '',
            packOf: product.packOf || ''
        });
        setShowModal(true);
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
                    src={params.row.images?.[0]?.imageUrl || 'https://via.placeholder.com/40'}
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
                <span className={`px-2 py-1 rounded text-xs ${params.value < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {params.value}
                </span>
            ),
        },
        { field: 'category', headerName: 'Category', width: 150, valueGetter: (value, row) => row.category?.name || 'N/A' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => openEditModal(params.row)} className="text-blue-600 hover:text-blue-800"><Pencil size={18} /></button>
                    <button onClick={() => handleDeleteProduct(params.row.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                </div>
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
                        className="text-xs p-1 border rounded bg-white dark:bg-gray-700 dark:text-white mt-2"
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
                        src={params.row.orderItem?.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/40'}
                        className="w-8 h-8 rounded"
                        alt=""
                    />
                    <div className="overflow-hidden">
                        <p className="text-xs truncate">{params.row.orderItem?.product?.name}</p>
                    </div>
                </div>
            )
        },
        { field: 'customer', headerName: 'Customer', width: 150, valueGetter: (value, row) => row.customer.name },
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
                        <Button size="sm" variant="primary" onClick={() => handleReturnAction(params.row.id, 'PICKED_UP')}>Picked Up</Button>
                    )}
                    {params.row.status === 'PICKED_UP' && (
                        <Button size="sm" variant="success" onClick={() => handleReturnAction(params.row.id, 'COMPLETED')}>Complete</Button>
                    )}
                </div>
            )
        },
    ];

    return (

        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your products and orders</p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus size={20} className="mr-2" /> Add Product
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto w-fit">
                {['overview', 'products', 'orders', 'returns'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize whitespace-nowrap
                            ${activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : (
                <>
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard label="Total Revenue" value={`₹${stats.totalRevenue}`} icon={DollarSign} colorClass="bg-green-500" />
                                <StatCard label="Total Orders" value={stats.totalOrders} icon={ShoppingBag} colorClass="bg-blue-500" />
                                <StatCard label="My Products" value={stats.totalProducts} icon={Package} colorClass="bg-purple-500" />
                                <StatCard label="Pending Orders" value={stats.pendingOrders} icon={AlertTriangle} colorClass="bg-yellow-500" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card title="Revenue Growth">
                                    <div className="h-64 w-full" style={{ minHeight: '250px' }}>
                                        {weeklyData && weeklyData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
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
                                            <div className="flex items-center justify-center h-full text-gray-400">No Data Available</div>
                                        )}
                                    </div>
                                </Card>
                                <Card title="Order Volume">
                                    <div className="h-64 w-full" style={{ minHeight: '250px' }}>
                                        {weeklyData && weeklyData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={weeklyData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                    <YAxis axisLine={false} tickLine={false} />
                                                    <Tooltip />
                                                    <Bar dataKey="orders" fill="#10B981" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">No Data Available</div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </div>
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
                                    className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="ALL">All Categories</option>
                                    {[...new Set(myProducts.map(p => p.category?.name))].filter(Boolean).map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
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
                        <Card title="Recent Orders">
                            {/* Filter Bar */}
                            <div className="flex gap-4 mb-4">
                                <Input
                                    placeholder="Search Order ID / Customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="max-w-xs"
                                />
                                <select
                                    className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>

                            <MuiThemeProvider theme={muiTheme}>
                                <Paper sx={{ width: '100%', height: 500, boxShadow: 'none' }}>
                                    <DataGrid
                                        rows={filteredData}
                                        columns={orderColumns}
                                        initialState={{ pagination: { paginationModel } }}
                                        pageSizeOptions={[5, 10]}
                                        checkboxSelection
                                        disableRowSelectionOnClick
                                    />
                                </Paper>
                            </MuiThemeProvider>
                        </Card>
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
                                    className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
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
                </>
            )}

            {/* Simple Add/Edit Product Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                    <Input
                        label="Product Name"
                        value={productForm.name}
                        onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Description"
                        value={productForm.description}
                        onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Price"
                            type="number"
                            value={productForm.price}
                            onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                            required
                        />
                        <Input
                            label="Stock Quantity"
                            type="number"
                            value={productForm.stockQuantity}
                            onChange={e => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Material"
                            value={productForm.material}
                            onChange={e => setProductForm({ ...productForm, material: e.target.value })}
                        />
                        <Input
                            label="Color"
                            value={productForm.color}
                            onChange={e => setProductForm({ ...productForm, color: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Size / Dimensions"
                            value={productForm.size}
                            onChange={e => setProductForm({ ...productForm, size: e.target.value })}
                        />
                        <Input
                            label="Origin"
                            value={productForm.origin}
                            onChange={e => setProductForm({ ...productForm, origin: e.target.value })}
                        />
                    </div>
                    <div>
                        <Input
                            label="Pack Of"
                            value={productForm.packOf}
                            onChange={e => setProductForm({ ...productForm, packOf: e.target.value })}
                            placeholder="e.g., 1, 2, Set of 3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                            value={productForm.categoryName}
                            onChange={e => setProductForm({ ...productForm, categoryName: e.target.value })}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                setSelectedFiles(prev => [...prev, ...files]);
                                e.target.value = ''; // Reset input so same file can be selected again if needed
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center">
                            <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                {selectedFiles.length > 0
                                    ? `${selectedFiles.length} file(s) selected`
                                    : "Click to upload product images"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB (Min 1, Max 8)</p>
                        </div>
                    </div>

                    {/* Image Previews */}
                    {selectedFiles.length > 0 && (
                        <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="relative group min-w-[100px] w-[100px] h-[100px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 shadow-md"
                                        title="Remove image"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Fallback URL input (optional, can hide if only upload is desired) */}
                    {/* <Input label="Or Image URL" value={productForm.imageUrl} ... /> */}
                    <Button type="submit" className="w-full">
                        {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                </form>
            </Modal>
        </div >
    );
};

export default SellerDashboard;
