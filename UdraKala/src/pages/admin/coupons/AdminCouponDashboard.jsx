import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCoupons } from '../../../store/slices/couponSlice';
import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AttachMoney, ConfirmationNumber, TrendingUp } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                        {title}
                    </Typography>
                    <Typography variant="h4">
                        {value}
                    </Typography>
                </Box>
                <Box sx={{
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: `${color}.light`,
                    color: `${color}.main`,
                    display: 'flex'
                }}>
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const AdminCouponDashboard = () => {
    const dispatch = useDispatch();
    const { coupons } = useSelector(state => state.coupon);

    useEffect(() => {
        dispatch(fetchAllCoupons());
    }, [dispatch]);

    // Derived Stats (Mocking backend aggregation for now)
    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter(c => c.isActive).length;
    const totalUsage = coupons.reduce((acc, curr) => acc + (curr.globalUsageCount || 0), 0);

    // Mock Data for Charts (Replace with API data later)
    const data = [
        { name: 'Jan', usage: 40, discount: 2400 },
        { name: 'Feb', usage: 30, discount: 1398 },
        { name: 'Mar', usage: 20, discount: 9800 },
        { name: 'Apr', usage: 27, discount: 3908 },
        { name: 'May', usage: 18, discount: 4800 },
        { name: 'Jun', usage: 23, discount: 3800 },
        { name: 'Jul', usage: 34, discount: 4300 },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Coupon Analytics</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Total Coupons"
                        value={`${activeCoupons} / ${totalCoupons}`}
                        icon={<ConfirmationNumber />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Total Redemptions"
                        value={totalUsage}
                        icon={<TrendingUp />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Total Discount Given"
                        value="₹24,500" // Placeholder until backend API is ready
                        icon={<AttachMoney />}
                        color="warning"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Redemption Trends</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="usage" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Discount Value</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="discount" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminCouponDashboard;
