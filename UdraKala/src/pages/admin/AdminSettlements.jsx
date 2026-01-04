import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { CheckCircle, PauseCircle, PlayCircle, RefreshCw } from 'lucide-react';
import { getAllSettlements, approvePayout, holdSettlement, releaseSettlement, getPlatformWallet } from '../../api/settlementApi';
import Swal from 'sweetalert2';

const AdminSettlements = () => {
    const [settlements, setSettlements] = useState([]);
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
    const [selectedSettlement, setSelectedSettlement] = useState(null);
    const [transactionRef, setTransactionRef] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sData, wData] = await Promise.all([getAllSettlements(), getPlatformWallet()]);
            setSettlements(sData);
            setWallet(wData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPayout = (settlement) => {
        setSelectedSettlement(settlement);
        setTransactionRef('');
        setPayoutDialogOpen(true);
    };

    const handleApprovePayout = async () => {
        if (!selectedSettlement) return;
        try {
            await approvePayout(selectedSettlement.id, transactionRef);
            Swal.fire('Success', 'Payout Approved Successfully', 'success');
            setPayoutDialogOpen(false);
            fetchData();
        } catch (error) {
            Swal.fire('Error', 'Failed to approve payout', 'error');
        }
    };

    const handleHold = async (id) => {
        try {
            await holdSettlement(id);
            fetchData();
        } catch (error) {
            Swal.fire('Error', 'Failed to hold settlement', 'error');
        }
    };

    const handleRelease = async (id) => {
        try {
            await releaseSettlement(id);
            fetchData();
        } catch (error) {
            Swal.fire('Error', 'Failed to release settlement', 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'READY': return 'info';
            case 'PAID': return 'success';
            case 'HOLD': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <Typography variant="h4" className="font-bold text-gray-800">
                    Seller Settlements
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<RefreshCw size={18} />}
                    onClick={fetchData}
                >
                    Refresh
                </Button>
            </div>

            {/* Wallet Stats */}
            {wallet && (
                <Paper className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg">
                    <Typography variant="subtitle1" className="opacity-80">Platform Wallet Balance</Typography>
                    <Typography variant="h3" className="font-bold mt-2">
                        ₹{wallet.totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </Typography>
                </Paper>
            )}

            <TableContainer component={Paper} className="shadow-md rounded-lg overflow-hidden">
                <Table>
                    <TableHead className="bg-gray-100">
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Order Amount</TableCell>
                            <TableCell>Platform Fee</TableCell>
                            <TableCell>Net Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" className="py-10">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : settlements.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" className="py-10 text-gray-500">
                                    No settlements found
                                </TableCell>
                            </TableRow>
                        ) : (
                            settlements.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-mono text-xs">{item.orderId.substring(0, 8)}</TableCell>
                                    <TableCell>₹{item.orderAmount}</TableCell>
                                    <TableCell className="text-red-500">-₹{item.platformFee + item.tax}</TableCell>
                                    <TableCell className="font-bold text-green-600">₹{item.netAmount}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={item.status}
                                            color={getStatusColor(item.status)}
                                            size="small"
                                            className="font-bold"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex justify-center gap-2">
                                            {item.status === 'READY' && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        startIcon={<CheckCircle size={16} />}
                                                        onClick={() => handleOpenPayout(item)}
                                                    >
                                                        Pay
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        startIcon={<PauseCircle size={16} />}
                                                        onClick={() => handleHold(item.id)}
                                                    >
                                                        Hold
                                                    </Button>
                                                </>
                                            )}
                                            {item.status === 'HOLD' && (
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    size="small"
                                                    startIcon={<PlayCircle size={16} />}
                                                    onClick={() => handleRelease(item.id)}
                                                >
                                                    Release
                                                </Button>
                                            )}
                                            {item.status === 'PAID' && (
                                                <span className="text-xs text-green-600 font-mono">
                                                    Ref: {item.transactionRef || 'N/A'}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Payout Dialog */}
            <Dialog open={payoutDialogOpen} onClose={() => setPayoutDialogOpen(false)}>
                <DialogTitle>Approve Payout</DialogTitle>
                <DialogContent className="space-y-4 pt-4 min-w-[400px]">
                    <Alert severity="info" className="mb-4">
                        Do you want to release <b>₹{selectedSettlement?.netAmount}</b> to Seller?
                    </Alert>
                    <TextField
                        autoFocus
                        label="Transaction Reference (Optional)"
                        fullWidth
                        variant="outlined"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g. UTR12345678"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPayoutDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleApprovePayout} variant="contained" color="primary">
                        Confirm Payout
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminSettlements;
