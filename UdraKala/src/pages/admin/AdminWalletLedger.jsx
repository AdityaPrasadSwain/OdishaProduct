import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, CircularProgress, Button
} from '@mui/material';
import { RefreshCw, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import api from '../../api/axios';

const AdminWalletLedger = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/wallet/ledger');
            setTransactions(response.data);
        } catch (error) {
            console.error("Failed to fetch ledger", error);
        } finally {
            setLoading(false);
        }
    };

    const getSourceColor = (source) => {
        switch (source) {
            case 'ORDER_PAYMENT': return 'success';
            case 'SELLER_PAYOUT': return 'warning';
            case 'AGENT_PAYOUT': return 'info';
            case 'REFUND': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <Typography variant="h4" className="font-bold text-gray-800">
                    Wallet Ledger (Audit Trail)
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
                            <TableCell>Type</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>Reference ID</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" className="py-10">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" className="py-10 text-gray-500">
                                    No transactions found
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((txn) => (
                                <TableRow key={txn.id} hover>
                                    <TableCell className="text-gray-600">
                                        {new Date(txn.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className={`flex items-center gap-1 font-bold ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-500'}`}>
                                            {txn.type === 'CREDIT' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            {txn.type}
                                        </div>
                                    </TableCell>
                                    <TableCell className={`font-mono font-bold ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                        {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={txn.source.replace('_', ' ')}
                                            color={getSourceColor(txn.source)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-gray-500">
                                        {txn.referenceId || '-'}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-700">
                                        {txn.description}
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

export default AdminWalletLedger;
