import React from 'react';
import { Eye } from 'lucide-react';
import { 
    GlassTableWrapper, 
    GlassThead, 
    GlassTh, 
    GlassTbody, 
    GlassTr, 
    GlassTd, 
    GlassBadge, 
    GlassIconButton 
} from './ui/GlassTable';

const OrdersTable = ({ data }) => {
    const orders = data || [
        { id: '#ORD-001', customer: 'Arun Kumar', product: 'Sambalpuri Saree', date: '2023-10-15', amount: '₹12,000', status: 'Delivered' },
        { id: '#ORD-002', customer: 'Priya Singh', product: 'Pattachitra Painting', date: '2023-10-14', amount: '₹4,500', status: 'Processing' },
        { id: '#ORD-003', customer: 'John Doe', product: 'Konark Wheel Replica', date: '2023-10-14', amount: '₹2,100', status: 'Shipped' },
        { id: '#ORD-004', customer: 'Sarah Smith', product: 'Tussar Silk Cloth', date: '2023-10-13', amount: '₹8,900', status: 'Pending' },
    ];

    const getStatusVariant = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'success';
            case 'processing': return 'primary';
            case 'shipped': return 'primary';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    return (
        <GlassTableWrapper>
            <div className="p-6 border-b border-white/20 dark:border-white/5 flex justify-between items-center bg-white/40 dark:bg-black/20 backdrop-blur-md">
                <h3 className="text-lg font-semibold text-text-primary dark:text-white">Recent Orders</h3>
                <button className="text-primary dark:text-primary text-sm font-medium hover:underline">View All</button>
            </div>
            <GlassThead>
                <GlassTh>Order ID</GlassTh>
                <GlassTh>Customer</GlassTh>
                <GlassTh>Product</GlassTh>
                <GlassTh>Date</GlassTh>
                <GlassTh>Amount</GlassTh>
                <GlassTh>Status</GlassTh>
                <GlassTh>Action</GlassTh>
            </GlassThead>
            <GlassTbody>
                {orders.map((order, index) => (
                    <GlassTr key={order.id} index={index}>
                        <GlassTd className="font-medium text-text-primary dark:text-white">{order.id}</GlassTd>
                        <GlassTd className="text-text-secondary dark:text-white/80">{order.customer}</GlassTd>
                        <GlassTd className="text-text-secondary dark:text-white/80">{order.product}</GlassTd>
                        <GlassTd className="text-text-secondary dark:text-white/60">{order.date}</GlassTd>
                        <GlassTd className="font-medium text-text-primary dark:text-white">{order.amount}</GlassTd>
                        <GlassTd>
                            <GlassBadge variant={getStatusVariant(order.status)}>
                                {order.status}
                            </GlassBadge>
                        </GlassTd>
                        <GlassTd>
                            <GlassIconButton icon={Eye} />
                        </GlassTd>
                    </GlassTr>
                ))}
            </GlassTbody>
        </GlassTableWrapper>
    );
};

export default OrdersTable;
