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

const normalizeUser = (user) => {
    if (!user) return null;

    // 1. ID Normalization
    // Check common ID fields. Fallback to a random string if absolutely missing to prevent list key crashes (though data is invalid).
    const id = user.id || user.userId || `unknown-${Math.random().toString(36).substr(2, 9)}`;

    // 2. Name Normalization
    let fullName = user.fullName;
    if (!fullName) {
        if (user.firstName) {
            fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        } else if (user.name) {
            fullName = user.name;
        } else {
            fullName = 'Unknown User';
        }
    }

    // 3. Avatar Normalization
    // If no profile picture, we rely on Initials in the UI, so null is fine.
    const profilePicture = user.profilePicture || user.avatar || user.avatarUrl || null;

    // 4. Contact Normalization
    const email = user.email || 'N/A';
    const phoneNumber = user.phoneNumber || user.phone || user.mobile || 'N/A';

    // 5. Status Normalization
    // Ensure boolean for blocked
    const blocked = !!user.blocked;

    return {
        ...user, // Keep original fields just in case
        id,
        fullName, // Standardized Name
        profilePicture,
        email,
        phoneNumber,
        blocked
    };
};

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
            } else {
                data = await adminApi.getCustomers();
            }
            // Debug: Inspect raw response
            console.log(`[AdminUserManagement] Raw ${activeTab} data:`, data);

            // Normalize Data
            const normalizedUsers = Array.isArray(data) ? data.map(normalizeUser).filter(Boolean) : [];
            console.log(`[AdminUserManagement] Normalized ${activeTab} data:`, normalizedUsers);

            setUsers(normalizedUsers);
        } catch (error) {
            console.error("Failed to fetch users", error);
            Swal.fire('Error', 'Failed to load user data', 'error');
        } finally {
            setLoading(false);
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
            primary: { main: '#5747C7' }, // Orange-600
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
            field: 'id',
            headerName: 'User ID',
            width: 120,
            renderCell: (params) => (
                <div className="flex items-center justify-start h-full">
                    <span className="font-mono text-xs text-text-secondary dark:text-text-secondary bg-bg-band dark:bg-bg-dark px-2 py-1 rounded">
                        {params.row.id.substring(0, 8)}
                    </span>
                </div>
            )
        },
        {
            field: 'user',
            headerName: 'User Details',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <div className="flex items-center gap-3 w-full h-full py-2">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold overflow-hidden text-sm border border-primary">
                        {params.row.profilePicture ? (
                            <img src={params.row.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            params.row.fullName?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="flex flex-col justify-center gap-0.5 overflow-hidden min-w-0">
                        <span className="font-semibold text-text-primary dark:text-text-secondary truncate w-full" title={params.row.fullName}>
                            {params.row.fullName}
                        </span>
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
                    <p className="text-sm text-text-secondary dark:text-text-secondary leading-tight">{params.row.email}</p>
                    <p className="text-xs text-text-secondary">{params.row.phoneNumber}</p>
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
                                className="p-1.5 text-status-success bg-green-50 rounded hover:bg-green-100"
                                title="Approve"
                            >
                                <CheckCircle size={18} />
                            </button>
                            <button
                                onClick={() => handleReject(params.row.id)}
                                className="p-1.5 text-status-error bg-red-50 rounded hover:text-status-error"
                                title="Reject"
                            >
                                <XCircle size={18} />
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => handleToggleBlock(params.row)}
                        className={`p-1.5 rounded ${params.row.blocked ? 'text-status-success bg-green-50 hover:bg-green-100' : 'text-primary bg-bg-band hover:bg-primary-light'}`}
                        title={params.row.blocked ? "Unblock" : "Block"}
                    >
                        {params.row.blocked ? <Shield size={18} /> : <Ban size={18} />}
                    </button>

                    {activeTab !== 'customers' && (
                        <button
                            onClick={() => navigate(`/admin/sellers/${params.row.id}`)}
                            className="p-1.5 text-primary hover:bg-blue-50 rounded"
                            title="View Details"
                        >
                            <Eye size={18} />
                        </button>
                    )}

                    <button
                        onClick={() => handleDelete(params.row.id)}
                        className="p-1.5 text-status-error hover:bg-red-50 rounded"
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
                <h1 className="text-2xl font-bold text-text-primary dark:text-text-secondary flex items-center gap-2">
                    <User className="text-primary" /> User Management
                </h1>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg border border-border dark:border-border bg-bg-surface dark:bg-bg-dark focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-1 bg-bg-band dark:bg-bg-dark p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition ${activeTab === 'customers' ? 'bg-bg-surface dark:bg-bg-dark text-primary shadow-sm' : 'text-text-secondary hover:text-text-secondary'}`}
                    >
                        Customers
                    </button>
                    <button
                        onClick={() => setActiveTab('sellers')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition ${activeTab === 'sellers' ? 'bg-bg-surface dark:bg-bg-dark text-primary shadow-sm' : 'text-text-secondary hover:text-text-secondary'}`}
                    >
                        Sellers
                    </button>

                </div>


            </div>

            {/* Table */}
            <div className="bg-bg-surface dark:bg-bg-dark rounded-xl shadow-sm overflow-hidden border border-border dark:border-border">
                {loading ? (
                    <div className="p-10 text-center text-text-secondary">Loading...</div>
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
                                rowHeight={80}
                            />
                        </Paper>
                    </MuiThemeProvider>
                )}
            </div>
        </div>
    );
};

export default AdminUserManagement;
