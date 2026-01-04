import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign,
    Box, Activity, Globe, Smartphone, Monitor, Instagram, ArrowUpRight
} from 'lucide-react';

// --- Mock Data (for UI Fidelity) ---
const mockMonthlySales = [
    { name: 'Week 1', current: 4000, last: 2400 },
    { name: 'Week 2', current: 3000, last: 1398 },
    { name: 'Week 3', current: 2000, last: 9800 },
    { name: 'Week 4', current: 2780, last: 3908 },
];

const mockOrderVolume = [
    { time: '10am', orders: 12 }, { time: '11am', orders: 19 },
    { time: '12pm', orders: 35 }, { time: '1pm', orders: 22 },
    { time: '2pm', orders: 40 }, { time: '3pm', orders: 55 },
];

const mockChannels = [
    { name: 'Marketplace', value: 45, color: '#2DD4BF' }, // Teal
    { name: 'Store', value: 25, color: '#3B82F6' },       // Blue
    { name: 'Website', value: 20, color: '#A3E635' },     // Lime
    { name: 'Social', value: 10, color: '#FACC15' },      // Yellow
];

const mockReelsTrend = [
    { day: 'Mon', views: 4000 }, { day: 'Tue', views: 3000 },
    { day: 'Wed', views: 2000 }, { day: 'Thu', views: 2780 },
    { day: 'Fri', views: 1890 }, { day: 'Sat', views: 2390 },
    { day: 'Sun', views: 3490 },
];

const mockReturns = [
    { name: 'Defective', value: 400, color: '#F87171' },
    { name: 'Wrong Item', value: 300, color: '#FBBF24' },
    { name: 'Changed Mind', value: 300, color: '#34D399' },
    { name: 'Other', value: 200, color: '#60A5FA' },
];

// --- Reusable Card Component ---
const DashboardCard = ({ title, children, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-sm dark:shadow-lg border border-gray-100 dark:border-white/5 ${className}`}
    >
        {title && <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">{title}</h3>}
        {children}
    </motion.div>
);

const SellerAnalyticsDashboard = () => {
    // We can hook up real data later, for now we use state to simulate fetching or defaults
    const [loading, setLoading] = useState(false); // Set to true if fetching real data
    const { theme } = useTheme(); // Access current theme

    // --- Currency Formatter ---
    const formatINR = (value) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);

    // Helper for chart tooltips based on theme
    const tooltipStyle = {
        backgroundColor: theme === 'dark' ? '#1E293B' : '#ffffff',
        border: theme === 'dark' ? 'none' : '1px solid #e5e7eb',
        borderRadius: '8px',
        color: theme === 'dark' ? '#fff' : '#1f2937',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] text-gray-900 dark:text-white p-6 md:p-8 font-sans transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-500">
                        Seller Analytics
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Real-time Overview • {new Date().toLocaleString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="bg-white dark:bg-[#1E293B] px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 shadow-sm">
                    Currency: <span className="text-teal-600 dark:text-teal-400 font-bold ml-1">INR (₹)</span>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* 1. Total Sales */}
                <DashboardCard className="relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Sales (Today)</p>
                            <h2 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{formatINR(125400)}</h2>
                            <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold mt-2 flex items-center">
                                <TrendingUp size={14} className="mr-1" />
                                +{formatINR(12500)} vs last week
                            </p>
                        </div>
                        <div className="p-3 bg-teal-100 dark:bg-teal-500/10 rounded-xl">
                            <DollarSign className="text-teal-600 dark:text-teal-400" size={24} />
                        </div>
                    </div>
                    {/* Mini Chart Background */}
                    <div className="h-16 mt-4 -mx-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockMonthlySales}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="current" stroke="#2DD4BF" fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </DashboardCard>

                {/* 2. Total Orders */}
                <DashboardCard>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Orders (Today)</p>
                            <h2 className="text-3xl font-bold mt-1">450</h2>
                            <p className="text-blue-600 dark:text-blue-400 text-xs font-semibold mt-2 flex items-center">
                                <TrendingUp size={14} className="mr-1" />
                                +8% volume
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl">
                            <ShoppingBag className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                    </div>
                    <div className="h-16 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockOrderVolume}>
                                <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 4, 4]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </DashboardCard>

                {/* 3. Net Profit */}
                <DashboardCard>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Net Profit (Monthly)</p>
                            <h2 className="text-3xl font-bold mt-1 text-lime-600 dark:text-lime-400">{formatINR(1127000)}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                                Margin: <span className="text-gray-900 dark:text-white font-bold">22%</span>
                            </p>
                        </div>
                        <div className="p-3 bg-lime-100 dark:bg-lime-500/10 rounded-xl">
                            <Activity className="text-lime-600 dark:text-lime-400" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Previous: {formatINR(925000)}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center"><TrendingUp size={12} className="mr-1" /> +{formatINR(202000)}</span>
                    </div>
                </DashboardCard>

                {/* 4. Avg Order Value (Gauge Style Sim) */}
                <DashboardCard>
                    <div className="flex justify-between items-start mb-6">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Avg Order Value</p>
                        <div className="p-3 bg-purple-100 dark:bg-purple-500/10 rounded-xl">
                            <Box className="text-purple-600 dark:text-purple-400" size={24} />
                        </div>
                    </div>
                    <div className="relative flex items-center justify-center py-4">
                        <div className="w-32 h-16 border-t-[12px] border-r-[12px] border-l-[12px] border-purple-500 rounded-t-full border-b-0 absolute top-0"></div>
                        <div className="w-32 h-16 border-[12px] border-gray-200 dark:border-gray-700 rounded-t-full border-b-0 opacity-30"></div>
                        <div className="mt-8 text-center">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatINR(2300)}</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Target: {formatINR(2500)}</p>
                        </div>
                    </div>
                </DashboardCard>
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* 5. Orders By Channel */}
                <DashboardCard title="Orders By Channel" className="lg:col-span-2">
                    <div className="space-y-6">
                        {mockChannels.map((channel) => (
                            <div key={channel.name}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                        {channel.name === 'Marketplace' && <Globe size={16} />}
                                        {channel.name === 'Store' && <ShoppingBag size={16} />}
                                        {channel.name === 'Website' && <Monitor size={16} />}
                                        {channel.name === 'Social' && <Instagram size={16} />}
                                        {channel.name}
                                    </span>
                                    <span className="font-bold text-gray-900 dark:text-white">{channel.value}%</span>
                                </div>
                                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${channel.value}%`, backgroundColor: channel.color }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>

                {/* 6. Sales By Location */}
                <DashboardCard title="Top Locations" className="lg:col-span-1">
                    <div className="space-y-4">
                        {[
                            { title: 'Mumbai', amount: 450000, percent: 35 },
                            { title: 'Delhi', amount: 320000, percent: 25 },
                            { title: 'Bangalore', amount: 280000, percent: 22 },
                            { title: 'Chennai', amount: 150000, percent: 12 },
                            { title: 'Kolkata', amount: 75000, percent: 6 },
                        ].map((loc, i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{loc.title}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatINR(loc.amount)}</p>
                                    <p className="text-xs text-gray-500">{loc.percent}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>
            </div>

            {/* Third Section: P&L and Reels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* 7. P&L Statement */}
                <DashboardCard title="P&L Statement (Monthly)" className="lg:col-span-1 border-l-4 border-l-teal-500">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-white/5">
                            <span className="text-gray-500 dark:text-gray-400">Sales Revenue</span>
                            <span className="text-gray-900 dark:text-white font-medium">{formatINR(125400)}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1">
                            <span className="text-red-500 dark:text-red-400">Platform Fees</span>
                            <span className="text-red-500 dark:text-red-400">-{formatINR(10000)}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1">
                            <span className="text-red-500 dark:text-red-400">Packaging</span>
                            <span className="text-red-500 dark:text-red-400">-{formatINR(2500)}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1">
                            <span className="text-red-500 dark:text-red-400">Shipping</span>
                            <span className="text-red-500 dark:text-red-400">-{formatINR(8000)}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1">
                            <span className="text-red-500 dark:text-red-400">Warehouse</span>
                            <span className="text-red-500 dark:text-red-400">-{formatINR(5000)}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1 border-b border-gray-100 dark:border-white/5 pb-2">
                            <span className="text-red-500 dark:text-red-400">Gateway Fees</span>
                            <span className="text-red-500 dark:text-red-400">-{formatINR(1200)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold pt-2">
                            <span className="text-teal-600 dark:text-teal-400">Net Profit</span>
                            <span className="text-teal-600 dark:text-teal-400">{formatINR(98700)}</span>
                        </div>
                    </div>
                </DashboardCard>

                {/* 9. Seller Reels Analytics */}
                <DashboardCard title="Reels Performance" className="lg:col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-100 dark:bg-black/20 p-4 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Total Reels</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">54</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-black/20 p-4 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Total Views</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">1.2M</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-black/20 p-4 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">CTR %</p>
                            <p className="text-xl font-bold text-yellow-500 dark:text-yellow-400">4.5%</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-black/20 p-4 rounded-xl border border-teal-500/30">
                            <p className="text-xs text-gray-500 mb-1">Sales from Reels</p>
                            <p className="text-xl font-bold text-teal-600 dark:text-teal-400">{formatINR(45000)}</p>
                        </div>
                    </div>
                    {/* Engagement Chart */}
                    <div className="h-48 w-full bg-gray-50 dark:bg-black/20 rounded-xl p-4 border border-gray-100 dark:border-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockReelsTrend}>
                                <defs>
                                    <linearGradient id="colorReels" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FACC15" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#FACC15" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    itemStyle={{ color: '#FACC15' }}
                                />
                                <Area type="monotone" dataKey="views" stroke="#FACC15" fillOpacity={1} fill="url(#colorReels)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </DashboardCard>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 10. Product Performance */}
                <DashboardCard title="Top Products">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-500 text-xs border-b border-gray-200 dark:border-white/10">
                                    <th className="py-3 font-medium">Product</th>
                                    <th className="py-3 font-medium">Stock</th>
                                    <th className="py-3 font-medium text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'Wireless Earbuds X20', stock: 150, revenue: 75000, status: 'In Stock' },
                                    { name: 'Smart Watch Pro', stock: 45, revenue: 62000, status: 'Low Stock' },
                                    { name: 'Running Shoes Gen 3', stock: 0, revenue: 45000, status: 'Out of Stock' },
                                    { name: 'Laptop Backpack', stock: 300, revenue: 32000, status: 'In Stock' },
                                ].map((product, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-3 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700"></div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{product.name}</span>
                                        </td>
                                        <td className="py-3">
                                            <span className={`text-xs px-2 py-1 rounded-full ${product.stock === 0 ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' :
                                                product.stock < 50 ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                                                    'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                                                }`}>
                                                {product.stock} units
                                            </span>
                                        </td>
                                        <td className="py-3 text-right text-sm font-bold text-teal-600 dark:text-teal-400">
                                            {formatINR(product.revenue)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>

                {/* 11. Returns & Cancellations */}
                <DashboardCard title="Returns & Cancellations">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Donut Chart */}
                        <div className="w-40 h-40 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={mockReturns}
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {mockReturns.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">25</span>
                                <span className="text-[10px] text-gray-500 uppercase">Returns</span>
                            </div>
                        </div>

                        {/* Stats Info */}
                        <div className="flex-1 w-full">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-100 dark:bg-white/5 p-3 rounded-lg text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Refunded</p>
                                    <p className="text-lg font-bold text-red-500 dark:text-red-400">{formatINR(5500)}</p>
                                </div>
                                <div className="bg-gray-100 dark:bg-white/5 p-3 rounded-lg text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Cancellations</p>
                                    <p className="text-lg font-bold text-gray-700 dark:text-white">10</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {mockReturns.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-gray-500 dark:text-gray-400">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-gray-700 dark:text-white">{Math.round((item.value / 1200) * 100)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
};

export default SellerAnalyticsDashboard;
