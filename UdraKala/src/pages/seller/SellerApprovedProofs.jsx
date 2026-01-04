import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Typography, Paper, Grid, Card, CardContent, CardMedia, Button, CircularProgress
} from '@mui/material';
import { Download, ExternalLink } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8086/api';

const SellerApprovedProofs = () => {
    const [proofs, setProofs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Need seller ID. Usually stored in context or JWT.
    // Assuming we can get it from localStorage 'user' object or JWT.
    // Let's decode or assume user object exists.
    const getSellerId = () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            return user.id;
        }
        return null; // Handle error
    };

    useEffect(() => {
        const sellerId = getSellerId();
        if (sellerId) {
            fetchProofs(sellerId);
        } else {
            setLoading(false);
            // handle login redirect?
        }
    }, []);

    const fetchProofs = async (sellerId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/seller/approved-proofs/${sellerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProofs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (url) => {
        window.open(url, '_blank');
    };

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
                My Approved Delivery Proofs
            </Typography>

            {loading ? <CircularProgress /> : (
                <Grid container spacing={3}>
                    {proofs.map((proof) => (
                        <Grid item xs={12} sm={6} md={4} key={proof.id}>
                            <Card elevation={3}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={proof.proofUrl}
                                    alt="Proof"
                                    sx={{ objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={() => handleDownload(proof.proofUrl)}
                                />
                                <CardContent>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Order ID: {proof.orderId}
                                    </Typography>
                                    <Typography variant="caption" display="block" gutterBottom>
                                        Uploaded: {new Date(proof.uploadDate).toLocaleDateString()}
                                    </Typography>
                                    {proof.remarks && (
                                        <Typography variant="body2" mt={1}>
                                            Remarks: {proof.remarks}
                                        </Typography>
                                    )}
                                    <Button
                                        size="small"
                                        startIcon={<ExternalLink size={16} />}
                                        onClick={() => handleDownload(proof.proofUrl)}
                                        sx={{ mt: 1 }}
                                    >
                                        View Full
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {proofs.length === 0 && (
                        <Box width="100%" textAlign="center" mt={4}>
                            <Typography color="textSecondary">No approved proofs found.</Typography>
                        </Box>
                    )}
                </Grid>
            )}

        </Box>
    );
};

export default SellerApprovedProofs;
