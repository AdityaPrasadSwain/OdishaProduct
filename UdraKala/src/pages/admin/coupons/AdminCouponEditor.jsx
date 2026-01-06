import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCoupon, updateCoupon, fetchAllCoupons } from '../../../store/slices/couponSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography, MenuItem, Grid, Paper, FormControlLabel, Switch } from '@mui/material';
import Swal from 'sweetalert2';

const AdminCouponEditor = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { coupons } = useSelector(state => state.coupon);

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        startDate: '',
        expiryDate: '',
        usageLimitPerUser: 1,
        globalUsageLimit: 100,
        isActive: true
    });

    useEffect(() => {
        if (isEdit) {
            const coupon = coupons.find(c => c.id === id);
            if (coupon) {
                setFormData({
                    ...coupon,
                    startDate: coupon.startDate, // Adjust date format if needed for input type="datetime-local"
                    expiryDate: coupon.expiryDate // ISO format usually works but verify "yyyy-MM-ddThh:mm"
                });
            } else {
                dispatch(fetchAllCoupons());
            }
        }
    }, [id, coupons, dispatch, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await dispatch(updateCoupon({ id, data: formData })).unwrap();
                Swal.fire('Success', 'Coupon updated successfully', 'success');
            } else {
                await dispatch(createCoupon(formData)).unwrap();
                Swal.fire('Success', 'Coupon created successfully', 'success');
            }
            navigate('/admin/coupons');
        } catch (err) {
            Swal.fire('Error', err, 'error');
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" mb={3}>{isEdit ? 'Edit Coupon' : 'Create New Coupon'}</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Coupon Code"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                disabled={isEdit}
                                inputProps={{ style: { textTransform: 'uppercase' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Discount Type"
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                            >
                                <MenuItem value="PERCENTAGE">Percentage (%)</MenuItem>
                                <MenuItem value="FLAT">Flat Amount (₹)</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Discount Value"
                                name="discountValue"
                                value={formData.discountValue}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Min Order Amount"
                                name="minOrderAmount"
                                value={formData.minOrderAmount}
                                onChange={handleChange}
                            />
                        </Grid>

                        {formData.discountType === 'PERCENTAGE' && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Max Discount Amount"
                                    name="maxDiscountAmount"
                                    value={formData.maxDiscountAmount}
                                    onChange={handleChange}
                                    helperText="Cap for percentage discount"
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Limit Per User"
                                name="usageLimitPerUser"
                                value={formData.usageLimitPerUser}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Global Usage Limit"
                                name="globalUsageLimit"
                                value={formData.globalUsageLimit}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="datetime-local"
                                label="Start Date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="datetime-local"
                                label="Expiry Date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={formData.isActive} onChange={handleChange} name="isActive" />}
                                label="Active"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" size="large" fullWidth>
                                {isEdit ? 'Update Coupon' : 'Create Coupon'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default AdminCouponEditor;
