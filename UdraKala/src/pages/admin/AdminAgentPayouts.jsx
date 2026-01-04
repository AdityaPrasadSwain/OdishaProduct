import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { CheckCircle, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import Swal from 'sweetalert2';

const AdminAgentPayouts = () => {
    const [earnings, setEarnings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
    const [selectedEarning, setSelectedEarning] = useState(null);
    const [transactionRef, setTransactionRef] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/logistics/agent-earnings');
            setEarnings(response.data);
        } catch (error) {
            console.error("Failed to fetch earnings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPayout = (earning) => {
        setSelectedEarning(earning);
        setTransactionRef('');
        setPayoutDialogOpen(true);
    };

    const handleApprovePayout = async () => {
        if (!selectedEarning) return;
        try {
            await api.post(`/admin/logistics/agent-earnings/${selectedEarning.id}/pay`,
                { transactionRef }
            );
            Swal.fire('Success', 'Payout Approved Successfully', 'success');
            setPayoutDialogOpen(false);
            fetchData();
        } catch (error) {
            Swal.fire('Error', 'Failed to approve payout', 'error');
        }
    };

    const getStatusColor = (status) => {
        return status === 'PAID' ? 'success' : 'warning';
    };

    return (
        <Box className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <Typography variant="h4" className="font-bold text-gray-800">
                    Agent Payouts
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<RefreshCw size={18} />}
                    onClick={fetchData}
                >
                    Refresh
                </Button>
            </div>

            <TableContainer component={Paper} className="shadow-md rounded-lg overflow-hidden">
                <Table>
                    <TableHead className="bg-gray-100">
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Agent ID</TableCell>
                            <TableCell>Ref (Shipment)</TableCell>
                            <TableCell>Distance</TableCell>
                            <TableCell>Amount</TableCell>
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
                        ) : earnings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" className="py-10 text-gray-500">
                                    No pending payouts found
                                </TableCell>
                            </TableRow>
                        ) : (
                            earnings.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-mono text-xs">{item.agentId}</TableCell>
                                    <TableCell className="font-mono text-xs text-gray-500">{item.shipmentId || '-'}</TableCell>
                                    <TableCell>{item.distanceKm} km</TableCell>
                                    <TableCell className="font-bold text-green-600">₹{item.amount}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={item.status}
                                            color={getStatusColor(item.status)}
                                            size="small"
                                            className="font-bold"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.status === 'PENDING' ? (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                startIcon={<CheckCircle size={16} />}
                                                onClick={() => handleOpenPayout(item)}
                                            >
                                                Pay
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-green-600 font-mono">
                                                Ref: {item.transactionRef || 'N/A'}
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Payout Dialog */}
            <Dialog open={payoutDialogOpen} onClose={() => setPayoutDialogOpen(false)}>
                <DialogTitle>Approve Agent Payout</DialogTitle>
                <DialogContent className="space-y-4 pt-4 min-w-[400px]">
                    <Alert severity="info" className="mb-4">
                        Do you want to release <b>₹{selectedEarning?.amount}</b> to Agent?
                    </Alert>
                    <TextField
                        autoFocus
                        label="Transaction Reference"
                        fullWidth
                        variant="outlined"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g. UPI-987654321"
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

export default AdminAgentPayouts;
