import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { User, CheckCircle, XCircle, Trash2, Ban, Shield, Lock, Search, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import Badge from '../../components/ui/Badge';
import { motion } from 'framer-motion';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useTheme } from '../../context/ThemeContext';

const AdminUserManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('customers');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [activeTab]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            let data = [];
            if (activeTab === 'sellers') {
                data = await adminApi.getSellers();
            } else if (activeTab === 'agents') {
                data = await adminApi.getAgents();
            } else {
                data = await adminApi.getCustomers();
            }
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            Swal.fire('Error', 'Failed to load user data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAgent = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Add Delivery Agent',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Full Name">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Email">' +
                '<input id="swal-input3" class="swal2-input" placeholder="Phone">' +
                '<input id="swal-input4" class="swal2-input" type="password" placeholder="Password">',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return {
                    fullName: document.getElementById('swal-input1').value,
                    email: document.getElementById('swal-input2').value,
                    phoneNumber: document.getElementById('swal-input3').value,
                    password: document.getElementById('swal-input4').value,
                    role: 'customer' // Dummy role to pass validation, backend overrides to DELIVERY_AGENT
                }
            }
        });

        if (formValues) {
            if (!formValues.fullName || !formValues.email || !formValues.password || !formValues.phoneNumber) {
                Swal.fire('Error', 'All fields are required', 'error');
                return;
            }
            try {
                await adminApi.createAgent(formValues);
                Swal.fire('Success', 'Agent created successfully', 'success');
                fetchUsers();
            } catch (error) {
                Swal.fire('Error', error.response?.data?.message || 'Failed to create agent', 'error');
            }
        }
    };

    const handleApprove = async (id) => {
        try {
            await adminApi.approveSeller(id);
            Swal.fire('Success', 'Seller approved successfully', 'success');
            fetchUsers();
        } catch (error) {
            Swal.fire('Error', 'Failed to approve seller', 'error');
        }
    };

    const handleReject = async (id) => {
        const { value: reason } = await Swal.fire({
            title: 'Reject Seller Application',
            input: 'textarea',
            inputLabel: 'Reason for Rejection',
            inputPlaceholder: 'Enter reason...',
            showCancelButton: true
        });

        if (reason) {
            try {
                await adminApi.rejectSeller(id, reason);
                Swal.fire('Rejected', 'Seller application rejected', 'success');
                fetchUsers();
            } catch (error) {
                Swal.fire('Error', 'Failed to reject seller', 'error');
            }
        }
    };

    const handleToggleBlock = async (user) => {
        const action = user.blocked ? 'unblock' : 'block';
        const confirm = await Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to ${action} this user?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: user.blocked ? '#10b981' : '#d33',
            confirmButtonText: `Yes, ${action}!`
        });

        if (confirm.isConfirmed) {
            try {
                if (user.blocked) {
                    await adminApi.unblockSeller(user.id); // Reusing endpoint (works for any user ID if backend allows)
                } else {
                    await adminApi.blockSeller(user.id);
                }
                Swal.fire('Success', `User ${action}ed successfully`, 'success');
                fetchUsers();
            } catch (error) {
                // Determine error message based on role (Customer block might not be implemented in backend API fully yet)
                Swal.fire('Error', `Failed to ${action} user`, 'error');
            }
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Delete User?',
            text: "This will soft-delete the user and remove them from frontend views.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirm.isConfirmed) {
            try {
                await adminApi.deleteSeller(id); // Reusing generic delete logic
                Swal.fire('Deleted', 'User has been deleted.', 'success');
                fetchUsers();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete user', 'error');
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Theme & Columns ---
    // Assuming 'useTheme' is provided by a parent context (e.g., from @mui/material/styles or a custom theme provider)
    // If not, you might need to define 'theme' state or remove useTheme() and hardcode 'light'/'dark'
    const { theme } = useTheme();
    const muiTheme = React.useMemo(() => createTheme({
        palette: {
            mode: theme === 'dark' ? 'dark' : 'light',
            primary: { main: '#ea580c' }, // Orange-600
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

    const columns = [
        {
            field: 'user',
            headerName: 'User',
            flex: 1,
            minWidth: 250,
            renderCell: (params) => (
                <div className="flex items-center gap-3 h-full">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden text-xs">
                        {params.row.profilePicture ? (
                            <img src={params.row.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            params.row.fullName?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">{params.row.fullName}</p>
                        <p className="text-[10px] text-gray-500">ID: {params.row.id.substring(0, 8)}...</p>
                    </div>
                </div>
            )
        },
        {
            field: 'contact',
            headerName: 'Contact',
            width: 250,
            renderCell: (params) => (
                <div className="flex flex-col justify-center h-full">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">{params.row.email}</p>
                    <p className="text-xs text-gray-400">{params.row.phoneNumber}</p>
                </div>
            )
        },
        ...(activeTab === 'sellers' ? [{
            field: 'shopName',
            headerName: 'Shop Name',
            width: 200,
            valueGetter: (value, row) => row.shopName || '-'
        }] : []),
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (
                <div className="flex flex-col gap-1 items-start justify-center h-full">
                    {params.row.blocked ? (
                        <Badge variant="danger">Blocked</Badge>
                    ) : (
                        <Badge variant="success">Active</Badge>
                    )}
                    {activeTab === 'sellers' && !params.row.approved && <Badge variant="warning" className="mt-1">Pending</Badge>}
                </div>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            renderCell: (params) => (
                <div className="flex items-center justify-end gap-2 h-full w-full">
                    {activeTab === 'sellers' && !params.row.approved && (
                        <>
                            <button
                                onClick={() => handleApprove(params.row.id)}
                                className="p-1.5 text-green-600 bg-green-50 rounded hover:bg-green-100"
                                title="Approve"
                            >
                                <CheckCircle size={18} />
                            </button>
                            <button
                                onClick={() => handleReject(params.row.id)}
                                className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100"
                                title="Reject"
                            >
                                <XCircle size={18} />
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => handleToggleBlock(params.row)}
                        className={`p-1.5 rounded ${params.row.blocked ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-orange-600 bg-orange-50 hover:bg-orange-100'}`}
                        title={params.row.blocked ? "Unblock" : "Block"}
                    >
                        {params.row.blocked ? <Shield size={18} /> : <Ban size={18} />}
                    </button>

                    {activeTab !== 'agents' && (
                        <button
                            onClick={() => navigate(`/admin/sellers/${params.row.id}`)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                        >
                            <Eye size={18} />
                        </button>
                    )}

                    <button
                        onClick={() => handleDelete(params.row.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Delete (Soft)"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <User className="text-orange-600" /> User Management
                </h1>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition ${activeTab === 'customers' ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Customers
                    </button>
                    <button
                        onClick={() => setActiveTab('sellers')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition ${activeTab === 'sellers' ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Sellers
                    </button>
                    <button
                        onClick={() => setActiveTab('agents')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition ${activeTab === 'agents' ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Delivery Agents
                    </button>
                </div>

                {activeTab === 'agents' && (
                    <button
                        onClick={handleCreateAgent}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                        + Add Agent
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Loading...</div>
                ) : (
                    <MuiThemeProvider theme={muiTheme}>
                        <Paper sx={{ width: '100%', height: 600, boxShadow: 'none' }}>
                            <DataGrid
                                rows={filteredUsers}
                                columns={columns}
                                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                                pageSizeOptions={[5, 10, 20]}
                                checkboxSelection
                                disableRowSelectionOnClick
                                getRowId={(row) => row.id}
                            />
                        </Paper>
                    </MuiThemeProvider>
                )}
            </div>
        </div>
    );
};

export default AdminUserManagement;
