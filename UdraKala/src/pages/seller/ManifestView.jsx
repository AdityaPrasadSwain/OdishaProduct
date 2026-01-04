import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, FormControl, InputLabel, Select, MenuItem, CircularProgress,
    IconButton, Tooltip
} from '@mui/material';
import { LocalShipping, PersonAdd, Send, Refresh, QrCodeScanner, Close } from '@mui/icons-material';
import Swal from 'sweetalert2';
import orderApi from '../../api/orderApi';
import logisticsApi from '../../api/logisticsApi';

const ManifestView = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [agents, setAgents] = useState([]);

    // Label Modal State
    const [openLabelModal, setOpenLabelModal] = useState(false);
    const [currentLabelOrder, setCurrentLabelOrder] = useState(null);

    // Assign Modal State
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState('');

    useEffect(() => {
        fetchData();
        // fetchAgents(); // Disabled for Seller
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await orderApi.getSellerOrders();
            // Filter relevant orders for manifest
            const relevantStatus = ['READY_TO_SHIP', 'ASSIGNED', 'DISPATCHED'];
            const manifestOrders = data.filter(o => relevantStatus.includes(o.status));
            setOrders(manifestOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewLabel = (order) => {
        setCurrentLabelOrder(order);
        setOpenLabelModal(true);
    };

    // const fetchAgents = async () => {
    //     try {
    //         const agentList = await logisticsApi.getDeliveryAgents();
    //         setAgents(agentList || []);
    //     } catch (error) {
    //         console.error("Error fetching agents:", error);
    //     }
    // };

    // const handleAssignClick = (order) => {
    //     setSelectedOrder(order);
    //     setOpenAssignModal(true);
    // };

    // const handleAssignSubmit = async () => {
    //     /* ... Code removed as Sellers cannot assign agents ... */
    // };

    // const handleDispatchClick = async (order) => {
    //    /* ... Code removed as Dispatch endpoint is Admin/Agent/System only ... */
    // };

    const getStatusChip = (status) => {
        let color = 'default';
        if (status === 'READY_TO_SHIP') color = 'info';
        else if (status === 'ASSIGNED') color = 'warning';
        else if (status === 'DISPATCHED') color = 'success';
        return <Chip label={status.replace(/_/g, ' ')} color={color} size="small" />;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" component="h2" fontWeight="bold">
                    Delivery Manifest & Dispatch
                </Typography>
                <IconButton onClick={fetchData} title="Refresh">
                    <Refresh />
                </IconButton>
            </Box>

            <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Tracking ID</TableCell>
                            <TableCell>Status</TableCell>
                            {/* <TableCell>Assigned Agent</TableCell> */}
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={24} />
                                </TableCell>
                            </TableRow>
                        ) : orders.length > 0 ? (
                            orders.map((order, index) => (
                                <TableRow key={order.orderId || order.id || index} hover>
                                    <TableCell sx={{ fontWeight: 'medium' }}>#{String(order.orderId || order.id || "").substring(0, 8)}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{order.customerName}</Typography>
                                        <Typography variant="caption" color="textSecondary">{(order.shippingAddress || "").substring(0, 20)}...</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                            {order.trackingId || "PENDING"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{getStatusChip(order.status)}</TableCell>

                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                            <Tooltip title="View Label">
                                                <IconButton
                                                    onClick={() => handleViewLabel(order)}
                                                    color="primary"
                                                    disabled={!order.trackingId}
                                                >
                                                    <QrCodeScanner />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    No orders ready for dispatch.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Label Modal */}
            <Dialog open={openLabelModal} onClose={() => setOpenLabelModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Shipping Label
                    <IconButton onClick={() => setOpenLabelModal(false)}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {currentLabelOrder && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, py: 3 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle2" gutterBottom>ORDER QR CODE</Typography>
                                <Box sx={{ border: '2px solid #eee', p: 1, borderRadius: 2 }}>
                                    <img
                                        src={`http://localhost:8085/api/label/qr/${currentLabelOrder.orderId || currentLabelOrder.id}`}
                                        alt="QR Code"
                                        style={{ width: 200, height: 200 }}
                                    />
                                </Box>
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    {currentLabelOrder.orderId || currentLabelOrder.id}
                                </Typography>
                            </Box>

                            <Box sx={{ width: '100%', height: '1px', bgcolor: 'divider' }} />

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle2" gutterBottom>TRACKING BARCODE</Typography>
                                <Box sx={{ border: '2px solid #eee', p: 2, borderRadius: 2, bgcolor: '#fff' }}>
                                    <img
                                        src={`http://localhost:8085/api/label/barcode/${currentLabelOrder.trackingId}`}
                                        alt="Barcode"
                                        style={{ maxWidth: '100%', height: 80 }}
                                    />
                                </Box>
                                <Typography variant="h6" sx={{ mt: 1, letterSpacing: 2, fontFamily: 'monospace' }}>
                                    {currentLabelOrder.trackingId}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => window.print()} color="primary">Print</Button>
                    <Button onClick={() => setOpenLabelModal(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManifestView;
