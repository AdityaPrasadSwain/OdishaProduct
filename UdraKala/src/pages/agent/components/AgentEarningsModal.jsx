import React, { useState, useEffect } from 'react';
import { Dialog, Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { X, IndianRupee } from 'lucide-react';
import { getEarnings } from '../../../api/agentApi';

const AgentEarningsModal = ({ isOpen, onClose }) => {
    const [earnings, setEarnings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchEarnings();
        }
    }, [isOpen]);

    const fetchEarnings = async () => {
        setLoading(true);
        try {
            const data = await getEarnings();
            setEarnings(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, bgcolor: 'transparent', boxShadow: 'none' } }}
        >
            <div className="bg-bg-surface dark:bg-bg-dark rounded-xl overflow-hidden shadow-2xl">
                <div className="bg-bg-dark p-4 text-text-onDark flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <IndianRupee className="text-green-400" />
                        <Typography variant="h6" fontWeight="bold">My Earnings History</Typography>
                    </div>
                    <IconButton onClick={onClose} className="text-text-secondary hover:text-text-onDark">
                        <X size={20} />
                    </IconButton>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto bg-bg-page dark:bg-bg-dark">
                    <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="dark:text-text-secondary font-bold">Date</TableCell>
                                    <TableCell className="dark:text-text-secondary font-bold">Order ID</TableCell>
                                    <TableCell className="dark:text-text-secondary font-bold">Distance</TableCell>
                                    <TableCell className="dark:text-text-secondary font-bold">Amount</TableCell>
                                    <TableCell className="dark:text-text-secondary font-bold">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">Loading...</TableCell>
                                    </TableRow>
                                ) : earnings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">No earnings found.</TableCell>
                                    </TableRow>
                                ) : (
                                    earnings.map((earning) => (
                                        <TableRow key={earning.id} hover className="dark:hover:bg-bg-dark">
                                            <TableCell className="dark:text-text-secondary">
                                                {new Date(earning.createdAt || Date.now()).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="dark:text-text-secondary font-mono text-xs">
                                                #{earning.shipmentId ? earning.shipmentId.substring(0, 8) : 'N/A'}...
                                            </TableCell>
                                            <TableCell className="dark:text-text-secondary">
                                                {earning.distanceKm} km
                                            </TableCell>
                                            <TableCell className="dark:text-text-onDark font-bold text-status-success">
                                                ₹{earning.amount}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={earning.status}
                                                    size="small"
                                                    color={earning.status === 'PAID' ? 'success' : 'warning'}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </Dialog>
    );
};

export default AgentEarningsModal;
