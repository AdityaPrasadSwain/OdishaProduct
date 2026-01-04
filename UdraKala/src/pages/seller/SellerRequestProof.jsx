import React, { useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Paper, Button, TextField, CircularProgress
} from '@mui/material';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8086/api';

const SellerRequestProof = () => {
    const [orderId, setOrderId] = useState(''); // User enters Order ID or selects
    const [loading, setLoading] = useState(false);
    // In a real app, you might select from a list of shipped orders.
    // For simplicity, we allow manual entry or assume this component is used inside an Order Detail view.
    // Let's make it a standalone request form.

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleRequest = async (e) => {
        e.preventDefault();
        if (!orderId) return;

        try {
            setLoading(true);
            // First we need to find shipmentId? Or backend supports orderId in DTO?
            // Backend SellerProofRequestDto has orderId now. Update it!

            await axios.post(`${API_URL}/seller/proof-requests`, {
                orderId: orderId, // We updated backend to accept this
                reason: "Seller requested manual verification"
            }, { headers: getAuthHeader() });

            Swal.fire('Success', 'Request submitted successfully. Waiting for Admin approval.', 'success');
            setOrderId('');
        } catch (error) {
            console.error("Proof request failed:", error);
            const msg = error.response?.data?.message || error.message || 'Request failed';
            Swal.fire('Error', msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Typography variant="h6" gutterBottom>Request Delivery Proof</Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
                Enter the Order ID to request access to its delivery proof.
            </Typography>
            <form onSubmit={handleRequest}>
                <TextField
                    label="Order ID"
                    fullWidth
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Request Access'}
                </Button>
            </form>
        </Paper>
    );
};

export default SellerRequestProof;
