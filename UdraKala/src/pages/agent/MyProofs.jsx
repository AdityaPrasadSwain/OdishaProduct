import React, { useState, useEffect } from 'react';
import { getAgentProofs } from '../../api/agentApi';
import { Grid, CircularProgress, Typography, Card, CardMedia, CardContent, Container, Box } from '@mui/material';
import { CheckCircle, Clock } from 'lucide-react';

const MyProofs = () => {
    const [proofs, setProofs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProofs();
    }, []);

    const fetchProofs = async () => {
        try {
            const data = await getAgentProofs();
            setProofs(data);
        } catch (error) {
            console.error("Failed to fetch proofs", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" className="py-8">
            <Typography variant="h4" className="font-bold mb-6 text-gray-800 dark:text-white">
                My Delivery Proofs
            </Typography>

            {proofs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Typography className="text-gray-500">No proofs uploaded yet.</Typography>
                </div>
            ) : (
                <Grid container spacing={3}>
                    {proofs.map((proof) => (
                        <Grid item xs={12} sm={6} md={4} key={proof.id}>
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
                                <Box className="relative pt-[75%] bg-gray-100">
                                    <CardMedia
                                        component="img"
                                        image={proof.imageUrl}
                                        alt="Delivery Proof"
                                        className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
                                        onClick={() => window.open(proof.imageUrl, '_blank')}
                                    />
                                </Box>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-2">
                                        <Typography variant="subtitle2" className="text-gray-500 font-mono text-xs">
                                            AID: {proof.shipmentId.substring(0, 8)}...
                                        </Typography>
                                        <div className="flex items-center gap-1 text-green-600">
                                            <CheckCircle size={14} />
                                            <span className="text-xs font-semibold">Verified</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                                        <Clock size={12} />
                                        <span>{new Date(proof.uploadedAt).toLocaleString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default MyProofs;
