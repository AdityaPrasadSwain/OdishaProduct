
import React, { useState, useEffect, useContext } from 'react';
import {
    Container, Grid, CardContent,
    TextField, MenuItem, Chip, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Switch, Box, CircularProgress, Typography
} from '@mui/material';
import {
    Refresh, LocalShipping, Visibility
} from '@mui/icons-material';
import {
    Package,
    CheckCircle,
    TrendingUp,
    IndianRupee,
    CreditCard,
    X
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { getAgentOrders, getAgentSummary } from '../../api/agentApi';
import { useAgentSocket } from '../../api/useAgentSocket';
import AgentShipmentModal from './components/AgentShipmentModal';
import AgentBankDetailsForm from './components/AgentBankDetailsForm'; // Import
import Card from '../../components/ui/Card';
import Swal from 'sweetalert2';
import { Dialog, DialogContent, IconButton } from '@mui/material'; // Import Dialog

import AgentEarningsModal from './components/AgentEarningsModal'; // Import

const StatCard = ({ label, value, icon: Icon, colorClass, onClick }) => (
    <Card
        onClick={onClick}
        className={`flex items-center gap-4 relative overflow-hidden h-full ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
    >
        <div className={`p-3 rounded-full ${colorClass} bg-opacity-20`}>
            <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
    </Card>
);

const DeliveryDashboard = () => {
    const { mode, toggleColorMode } = useContext(ThemeContext);
    const [orders, setOrders] = useState([]);
    const [summary, setSummary] = useState({
        totalOrders: 0,
        completedOrders: 0,
        earningsToday: 0,
        totalEarnings: 0
    });
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [isOnline, setIsOnline] = useState(() => {
        return localStorage.getItem('isAgentOnline') === 'true';
    });

    const [selectedShipment, setSelectedShipment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBankDetailsOpen, setIsBankDetailsOpen] = useState(false);
    const [isEarningsOpen, setIsEarningsOpen] = useState(false); // Added missing state
    const [agentId, setAgentId] = useState(null);

    const fetchDashboardData = React.useCallback(async () => {
        setLoading(true);
        try {
            const [ordersData, summaryData] = await Promise.all([
                getAgentOrders(),
                getAgentSummary()
            ]);
            setOrders(ordersData);
            setSummary(summaryData);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load dashboard data'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const handleOrderUpdate = React.useCallback((updatedOrder) => {
        console.log("Socket Update Received:", updatedOrder);
        fetchDashboardData();
    }, [fetchDashboardData]);

    useAgentSocket(agentId, handleOrderUpdate);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setAgentId(user.id);
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
        fetchDashboardData();
    }, [fetchDashboardData]);

    useEffect(() => {
        localStorage.setItem('isAgentOnline', isOnline);
    }, [isOnline]);

    const handleManage = (order) => {
        const mappedShipment = {
            id: order.shipmentId || order.orderId,
            status: order.status,
            order: {
                id: order.orderId,
                shippingAddress: order.shippingAddress,
                totalAmount: order.totalAmount,
                user: {
                    phoneNumber: order.customerPhone,
                    fullName: order.customerName
                }
            },
            shippingLatitude: order.customerLat,
            shippingLongitude: order.customerLng
        };

        setSelectedShipment(mappedShipment);
        setIsModalOpen(true);
    };

    const getStatusChip = (status) => {
        let color = 'default';
        if (['DELIVERED', 'COMPLETED'].includes(status)) color = 'success';
        else if (['OUT_FOR_DELIVERY', 'IN_TRANSIT'].includes(status)) color = 'warning';
        else if (['DELIVERY_FAILED', 'RETURNED', 'CANCELLED'].includes(status)) color = 'error';
        else if (['READY_TO_SHIP', 'ASSIGNED'].includes(status)) color = 'primary';

        return (
            <Chip
                label={status.replace(/_/g, ' ')}
                color={color}
                size="small"
                sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
            />
        );
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
        const matchesSearch =
            (order.orderId && order.orderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" className="text-gray-900 dark:text-white">
                        Delivery Dashboard
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Button
                            variant="outlined"
                            startIcon={<IndianRupee size={18} />}
                            onClick={() => setIsEarningsOpen(true)}
                            color="inherit"
                        >
                            Earnings
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<CreditCard size={18} />}
                            onClick={() => setIsBankDetailsOpen(true)}
                            color="inherit"
                        >
                            Bank Details
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<CheckCircle size={18} />}
                            onClick={() => window.location.href = '/agent/proofs'}
                            color="inherit"
                        >
                            My Proofs
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                            <Typography variant="body1" fontWeight="medium" className="text-gray-700 dark:text-gray-300">
                                {isOnline ? 'Active' : 'Offline'}
                            </Typography>
                        </Box>
                        <Switch
                            checked={isOnline}
                            onChange={(e) => setIsOnline(e.target.checked)}
                            color="success"
                        />
                    </Box>
                </Box>


                <AgentEarningsModal
                    isOpen={isEarningsOpen}
                    onClose={() => setIsEarningsOpen(false)}
                />

                {/* Summary Stats */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            label="Total Orders"
                            value={summary.totalOrders}
                            icon={Package}
                            colorClass="bg-blue-500"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            label="Completed"
                            value={summary.completedOrders}
                            icon={CheckCircle}
                            colorClass="bg-green-500"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            label="Today's Earnings"
                            value={`₹${summary.earningsToday}`}
                            icon={IndianRupee}
                            colorClass="bg-orange-500"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            label="Total Earnings"
                            value={`₹${summary.totalEarnings}`}
                            icon={TrendingUp}
                            colorClass="bg-purple-500"
                        />
                    </Grid>
                </Grid>

                {/* Filters */}
                <Card className="mb-6">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={5}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search by Order ID or Customer Name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    sx: { borderRadius: '8px' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Status Filter"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                SelectProps={{
                                    sx: { borderRadius: '8px' }
                                }}
                            >
                                <MenuItem value="ALL">All Shipments</MenuItem>
                                <MenuItem value="ASSIGNED">Assigned</MenuItem>
                                <MenuItem value="OUT_FOR_DELIVERY">Out for Delivery</MenuItem>
                                <MenuItem value="DELIVERED">Delivered</MenuItem>
                                <MenuItem value="DELIVERY_FAILED">Failed</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                startIcon={<Refresh />}
                                onClick={fetchDashboardData}
                                variant="outlined"
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    px: 3
                                }}
                            >
                                Refresh
                            </Button>
                        </Grid>
                    </Grid>
                </Card>

                {/* Orders Table */}
                <Card title="Active Shipments" className="overflow-hidden p-0 shadow-lg">
                    <TableContainer>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                                <CircularProgress size={40} thickness={4} />
                            </Box>
                        ) : (
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead className="bg-gray-50/50 dark:bg-gray-800/50">
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Order Details</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Customer Info</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }} align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <TableRow key={order.orderId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">
                                                    <Typography variant="body2" fontWeight="700" className="text-primary-600">
                                                        #{order.orderId.substring(0, 8).toUpperCase()}
                                                    </Typography>
                                                    <Typography variant="caption" className="text-gray-400">
                                                        {new Date(order.createdDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="600" className="text-gray-900 dark:text-white">
                                                        {order.customerName}
                                                    </Typography>
                                                    <Typography variant="caption" display="block" className="text-gray-500 truncate max-w-[220px]">
                                                        {order.shippingAddress}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{getStatusChip(order.status)}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                        <Chip
                                                            label={order.paymentMode}
                                                            size="small"
                                                            variant="filled"
                                                            color={order.isCod ? 'warning' : 'success'}
                                                            sx={{
                                                                fontWeight: 600,
                                                                fontSize: '0.65rem',
                                                                height: '20px',
                                                                width: 'fit-content'
                                                            }}
                                                        />
                                                        {order.isCod && (
                                                            <Typography variant="caption" fontWeight="bold" color="error.main">
                                                                Collect ₹{order.totalAmount}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<Visibility size={16} />}
                                                        onClick={() => handleManage(order)}
                                                        sx={{
                                                            textTransform: 'none',
                                                            borderRadius: '8px',
                                                            boxShadow: 'none',
                                                            fontWeight: 600,
                                                            '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                                                        }}
                                                    >
                                                        Manage
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                                <Box sx={{ opacity: 0.4 }}>
                                                    <LocalShipping sx={{ fontSize: 64, mb: 2 }} />
                                                    <Typography variant="h6">No shipments to display</Typography>
                                                    <Typography variant="body2">Check back later or try adjusting your filters</Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                </Card>

                {/* Agent Shipment Modal */}
                {selectedShipment && (
                    <AgentShipmentModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            fetchDashboardData();
                        }}
                        shipment={selectedShipment}
                    />
                )}

                {/* Bank Details Modal */}
                <Dialog
                    open={isBankDetailsOpen}
                    onClose={() => setIsBankDetailsOpen(false)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: 3, bgcolor: 'transparent', boxShadow: 'none' } }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <IconButton
                            onClick={() => setIsBankDetailsOpen(false)}
                            sx={{ position: 'absolute', right: 8, top: 8, color: 'white', zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)' }}
                        >
                            <X size={20} />
                        </IconButton>
                        <AgentBankDetailsForm />
                    </Box>
                </Dialog>
            </Container>
        </div >
    );
};

export default DeliveryDashboard;
