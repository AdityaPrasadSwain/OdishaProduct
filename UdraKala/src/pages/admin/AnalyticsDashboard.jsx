import React, { useState, useEffect } from 'react';
import KpiCard from '../../components/KpiCard';
import RevenueChart from '../../components/RevenueChart';
import CountryMap from '../../components/CountryMap';
import OrdersTable from '../../components/OrdersTable';
import { motion as Motion } from 'motion/react';
import API from '../../api/api';

const AnalyticsDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [revenueData, setRevenueData] = useState(null);
    const [countryStats, setCountryStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Try to fetch from API, fall back to mock data if fails
                try {
                    const summaryRes = await API.get('/admin/analytics/summary');
                    setSummary(summaryRes.data);
                } catch {
                    console.log('Using mock summary data');
                    setSummary({
                        totalSales: 1234,
                        salesDelta: 12.5,
                        newCustomers: 89,
                        customersDelta: 8.2,
                        returnedProducts: 12,
                        returnsDelta: -3.1,
                        totalRevenue: 45678,
                        revenueDelta: 15.3
                    });
                }

                try {
                    const revenueRes = await API.get('/admin/analytics/revenue');
                    setRevenueData(revenueRes.data);
                } catch {
                    console.log('Using mock revenue data');
                    setRevenueData([
                        { name: 'Jan', value: 4000 },
                        { name: 'Feb', value: 3000 },
                        { name: 'Mar', value: 5000 },
                        { name: 'Apr', value: 2780 },
                        { name: 'May', value: 6890 },
                        { name: 'Jun', value: 5390 },
                        { name: 'Jul', value: 7490 },
                    ]);
                }

                try {
                    const ordersRes = await API.get('/admin/orders');
                    setOrders(ordersRes.data || []);
                } catch {
                    console.log('Using mock orders data');
                    setOrders([]);
                }

                try {
                    const countryRes = await API.get('/admin/analytics/country');
                    setCountryStats(countryRes.data);
                } catch {
                    console.log('Using mock country data');
                    setCountryStats([
                        { country: 'India', value: 80 },
                        { country: 'USA', value: 10 },
                        { country: 'UK', value: 5 },
                        { country: 'Others', value: 5 }
                    ]);
                }
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* KPI Cards */}
            <Motion.div
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {summary && (
                    <>
                        <KpiCard title="Total Sales" value={summary.totalSales} delta={summary.salesDelta} icon="TrendingUp" />
                        <KpiCard title="New Customers" value={summary.newCustomers} delta={summary.customersDelta} icon="UserPlus" />
                        <KpiCard title="Returned Products" value={summary.returnedProducts} delta={summary.returnsDelta} icon="RefreshCcw" />
                        <KpiCard title="Total Revenue" value={summary.totalRevenue} delta={summary.revenueDelta} icon="DollarSign" />
                    </>
                )}
            </Motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RevenueChart data={revenueData} />
                {countryStats && <CountryMap data={countryStats} />}
            </div>

            {/* Orders Table */}
            {orders.length > 0 && <OrdersTable data={orders} />}
        </div>
    );
};

export default AnalyticsDashboard;
