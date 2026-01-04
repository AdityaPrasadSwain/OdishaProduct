import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, CircularProgress, Chip, TextField
} from '@mui/material';
import { Eye, Download } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8086/api';

const AdminProofList = () => {
    const [proofs, setProofs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterOrderId, setFilterOrderId] = useState('');

    useEffect(() => {
        fetchProofs();
    }, []);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchProofs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/admin/delivery-proofs`, { headers: getAuthHeader() });
            setProofs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (url) => {
        Swal.fire({
            imageUrl: url,
            imageAlt: 'Proof',
            width: 600,
            showConfirmButton: false,
            showCloseButton: true
        });
    };

    const filteredProofs = proofs.filter(p =>
        !filterOrderId || p.orderId.toString().includes(filterOrderId)
    );

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
                Assigned Delivery Proofs
            </Typography>

            <Box mb={3} display="flex" gap={2}>
                <TextField
                    label="Filter by Order ID"
                    size="small"
                    value={filterOrderId}
                    onChange={(e) => setFilterOrderId(e.target.value)}
                />
                <Button variant="outlined" onClick={fetchProofs}>Refresh</Button>
            </Box>

            {loading ? <CircularProgress /> : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Agent ID</TableCell>
                                <TableCell>Verified</TableCell>
                                <TableCell>Remarks</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProofs.map((proof) => (
                                <TableRow key={proof.id}>
                                    <TableCell>{new Date(proof.uploadedAt).toLocaleString()}</TableCell>
                                    <TableCell title={proof.orderId}>{proof.orderId?.substring(0, 8)}...</TableCell>
                                    <TableCell title={proof.agentId}>{proof.agentId?.substring(0, 8)}...</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={proof.verified ? "Verified" : "Pending"}
                                            color={proof.verified ? "success" : "warning"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{proof.remarks || '-'}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            onClick={() => handleView(proof.imageUrl)}
                                            startIcon={<Eye size={16} />}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredProofs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No proofs found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default AdminProofList;
