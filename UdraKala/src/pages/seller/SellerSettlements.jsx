import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Button } from '@mui/material';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { getMySettlements } from '../../api/settlementApi';

const SellerSettlements = () => {
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getMySettlements();
            setSettlements(data);
        } catch (error) {
            console.error("Failed to fetch settlements", error);
        } finally {
            setLoading(false);
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

    const totalEarned = settlements
        .filter(s => s.status === 'PAID')
        .reduce((sum, item) => sum + item.netAmount, 0);

    const pendingPayout = settlements
        .filter(s => s.status === 'READY')
        .reduce((sum, item) => sum + item.netAmount, 0);

    return (
        <Box className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <Typography variant="h4" className="font-bold text-text-primary">
                    My Settlements
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<RefreshCw size={18} />}
                    onClick={fetchData}
                >
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Paper className="p-6 bg-gradient-to-r from-green-600 to-green-800 text-text-onDark rounded-xl shadow-lg">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                        <TrendingUp size={20} />
                        <Typography variant="subtitle1">Total Payouts Received</Typography>
                    </div>
                    <Typography variant="h3" className="font-bold">
                        ₹{totalEarned.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </Typography>
                </Paper>

                <Paper className="p-6 bg-bg-surface border border-border rounded-xl shadow-sm">
                    <Typography variant="subtitle1" className="text-text-secondary">Pending Payouts</Typography>
                    <Typography variant="h3" className="font-bold text-primary">
                        ₹{pendingPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="caption" className="text-text-secondary">
                        * Requires Admin Approval
                    </Typography>
                </Paper>
            </div>

            <TableContainer component={Paper} className="shadow-md rounded-lg overflow-hidden">
                <Table>
                    <TableHead className="bg-bg-page">
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Order Amount</TableCell>
                            <TableCell>Deductions (Fee+Tax)</TableCell>
                            <TableCell>Net Earning</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Payment Ref</TableCell>
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
                                <TableCell colSpan={7} align="center" className="py-10 text-text-secondary">
                                    No settlement history found
                                </TableCell>
                            </TableRow>
                        ) : (
                            settlements.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-mono text-xs">{item.orderId.substring(0, 8)}</TableCell>
                                    <TableCell>₹{item.orderAmount}</TableCell>
                                    <TableCell className="text-status-error">-₹{(item.platformFee + item.tax).toFixed(2)}</TableCell>
                                    <TableCell className="font-bold text-status-success">₹{item.netAmount}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={item.status}
                                            color={getStatusColor(item.status)}
                                            size="small"
                                            className="font-bold"
                                        />
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-text-secondary">
                                        {item.transactionRef || '-'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SellerSettlements;
