import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Chip, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, CircularProgress
} from '@mui/material';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8086/api';

const ProofRequestManager = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [comment, setComment] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [uploadImageUrl, setUploadImageUrl] = useState('');
    const [uploadShipmentId, setUploadShipmentId] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, [filterStatus]);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const url = filterStatus === 'ALL'
                ? `${API_URL}/admin/proof-requests`
                : `${API_URL}/admin/proof-requests?status=${filterStatus}`;

            const response = await axios.get(url, { headers: getAuthHeader() });
            setRequests(response.data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (request, action) => {
        setSelectedRequest({ ...request, action }); // action: APPROVED or REJECTED
        setComment('');
        setOpenDialog(true);
    };

    const submitDecision = async () => {
        if (!selectedRequest) return;

        try {
            const endpoint = selectedRequest.action === 'APPROVED'
                ? `/admin/proof-requests/${selectedRequest.id}/approve`
                : `/admin/proof-requests/${selectedRequest.id}/reject`;

            const payload = selectedRequest.action === 'REJECTED' ? { comment: comment } : {};

            await axios.post(`${API_URL}${endpoint}`, payload, {
                headers: getAuthHeader()
            });

            Swal.fire('Success', `Request ${selectedRequest.action}`, 'success');
            setOpenDialog(false);
            fetchRequests();
        } catch (error) {
            Swal.fire('Error', 'Failed to process request', 'error');
        }
    };

    const getStatusChip = (status) => {
        const colors = {
            PENDING: 'warning',
            APPROVED: 'success',
            REJECTED: 'error'
        };
        return <Chip label={status} color={colors[status] || 'default'} size="small" />;
    };

    const handleViewProof = async (shipmentId) => {
        try {
            Swal.showLoading();
            const response = await axios.get(`${API_URL}/admin/delivery-proof/${shipmentId}`, { headers: getAuthHeader() });
            const proof = response.data; // Assuming single proof or list? Controller returns Optional<DeliveryProof> body. So likely object.

            if (proof && proof.imageUrl) {
                Swal.fire({
                    title: 'Delivery Proof',
                    imageUrl: proof.imageUrl,
                    imageAlt: 'Delivery Proof',
                    width: 600,
                    showCloseButton: true,
                    showConfirmButton: false
                });
            } else {
                Swal.fire('Info', 'No proof image available', 'info');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Info', 'No proof uploaded for this shipment yet', 'info');
        }
    };

    const submitUpload = async () => {
        try {
            if (!uploadImageUrl) {
                Swal.fire('Error', 'Please enter an Image URL', 'error');
                return;
            }

            // Backend expects @RequestParam imageUrl
            await axios.post(`${API_URL}/admin/delivery-proof/${uploadShipmentId}`, null, {
                params: { imageUrl: uploadImageUrl },
                headers: getAuthHeader()
            });

            Swal.fire('Success', 'Proof uploaded successfully', 'success');
            setUploadDialogOpen(false);
            // Optionally auto-approve if pending?
            // For now just fetch requests
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to upload proof', 'error');
        }
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">Seller Proof Requests</Typography>
                <Box>
                    <Button onClick={() => setFilterStatus('ALL')} variant={filterStatus === 'ALL' ? 'contained' : 'outlined'} sx={{ mr: 1 }}>All</Button>
                    <Button onClick={() => setFilterStatus('PENDING')} variant={filterStatus === 'PENDING' ? 'contained' : 'outlined'}>Pending</Button>
                </Box>
            </Box>

            {loading ? <CircularProgress /> : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Seller ID</TableCell>
                                <TableCell>Shipment ID</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell>{new Date(req.requestedAt).toLocaleDateString()}</TableCell>
                                    <TableCell title={req.sellerId}>{req.sellerId.substring(0, 8)}...</TableCell>
                                    <TableCell title={req.shipmentId}>
                                        {req.shipmentId.substring(0, 8)}...
                                        <Button
                                            size="small"
                                            onClick={() => handleViewProof(req.shipmentId)}
                                            sx={{ minWidth: '30px', ml: 1, p: 0.5 }}
                                            title="View Proof"
                                        >
                                            <Eye size={16} />
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                setUploadShipmentId(req.shipmentId);
                                                setUploadImageUrl('');
                                                setUploadDialogOpen(true);
                                            }}
                                            sx={{ minWidth: '30px', ml: 0.5, p: 0.5, color: 'info.main' }}
                                            title="Upload/Send Proof"
                                        >
                                            <span style={{ fontSize: '16px' }}>📤</span>
                                        </Button>
                                    </TableCell>
                                    <TableCell>{req.reason}</TableCell>
                                    <TableCell>{getStatusChip(req.status)}</TableCell>
                                    <TableCell>
                                        {req.status === 'PENDING' && (
                                            <>
                                                <Button
                                                    size="small"
                                                    color="success"
                                                    onClick={() => handleAction(req, 'APPROVED')}
                                                    startIcon={<CheckCircle size={16} />}
                                                    sx={{ mr: 1 }}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleAction(req, 'REJECTED')}
                                                    startIcon={<XCircle size={16} />}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        {req.status !== 'PENDING' && (
                                            <Typography variant="caption" color="textSecondary">
                                                By Admin: {req.adminComment || '-'}
                                            </Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {requests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No requests found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    {selectedRequest?.action === 'APPROVED' ? 'Approve Request' : 'Reject Request'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" gutterBottom>
                        Reason for request: {selectedRequest?.reason}
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Admin Comment (Optional)"
                        fullWidth
                        multiline
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={submitDecision} variant="contained" color={selectedRequest?.action === 'APPROVED' ? 'success' : 'error'}>
                        Confirm {selectedRequest?.action}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
                <DialogTitle>Upload Delivery Proof Manually</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" gutterBottom>
                        Paste the Image URL for the proof.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Image URL"
                        fullWidth
                        value={uploadImageUrl}
                        onChange={(e) => setUploadImageUrl(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                    <Button onClick={submitUpload} variant="contained" color="primary">
                        Upload & Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default ProofRequestManager;
