import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { Save, Building2 } from 'lucide-react';
import { getBankDetails, updateBankDetails } from '../../../api/agentApi';
import Swal from 'sweetalert2';

const AgentBankDetailsForm = () => {
    const [details, setDetails] = useState({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifsc: '',
        upiId: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const data = await getBankDetails();
            if (data) {
                setDetails({
                    accountHolderName: data.accountHolderName || '',
                    bankName: data.bankName || '',
                    accountNumber: data.accountNumber || '',
                    ifsc: data.ifsc || '',
                    upiId: data.upiId || ''
                });
                setFetched(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateBankDetails(details);
            Swal.fire('Success', 'Bank details updated successfully', 'success');
            setFetched(true);
        } catch (error) {
            Swal.fire('Error', 'Failed to save bank details', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-lg rounded-xl overflow-hidden mt-6">
            <div className="bg-gray-800 p-4 text-white flex items-center gap-3">
                <Building2 size={24} className="text-orange-500" />
                <Typography variant="h6" fontWeight="bold">
                    My Bank Details
                </Typography>
            </div>
            <CardContent className="dark:bg-gray-900">
                <Box mb={3}>
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                        These details will be used for your weekly payouts. Please ensure they are correct.
                    </Alert>
                </Box>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Account Holder Name"
                                name="accountHolderName"
                                value={details.accountHolderName}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{ sx: { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Bank Name"
                                name="bankName"
                                value={details.bankName}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{ sx: { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Account Number"
                                name="accountNumber"
                                value={details.accountNumber}
                                onChange={handleChange}
                                required
                                type="password" // Masked for security in UI feeling
                                helperText="Enter full account number"
                                variant="outlined"
                                InputProps={{ sx: { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="IFSC Code"
                                name="ifsc"
                                value={details.ifsc}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{ sx: { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="UPI ID (Optional)"
                                name="upiId"
                                value={details.upiId}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="e.g. name@okhdfcbank"
                                InputProps={{ sx: { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={<Save />}
                                sx={{
                                    bgcolor: '#ea580c',
                                    '&:hover': { bgcolor: '#c2410c' },
                                    px: 5,
                                    borderRadius: 2
                                }}
                            >
                                {loading ? 'Saving...' : 'Save Details'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default AgentBankDetailsForm;
