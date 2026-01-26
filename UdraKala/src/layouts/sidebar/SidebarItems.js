import { LayoutDashboard, ShoppingBag, Users, FileText, Settings, ShoppingCart, User, Heart, Truck, BookOpen, BadgeIndianRupee, Ticket } from 'lucide-react';

export const splitRoleItems = (role) => {
    const common = [];

    if (role === 'ROLE_ADMIN') {
        return [
            { id: 1, title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
            { id: 2, title: 'Analytics', icon: FileText, href: '/admin/analytics' },
            { id: 9, title: 'Coupons', icon: Ticket, href: '/admin/coupons' }, // Added Coupon Link
            { id: 4, title: 'Shipments', icon: Truck, href: '/admin/shipments' },

            { id: 7, title: 'Accounting', icon: BadgeIndianRupee, href: '/admin/accounting' },
            { id: 5, title: 'Settings', icon: Settings, href: '#' },
        ];
    }

    if (role === 'ROLE_SELLER') {
        return [
            { id: 1, title: 'Dashboard', icon: LayoutDashboard, href: '/seller/dashboard' },
            { id: 2, title: 'Status', icon: FileText, href: '/seller/status' },

            { id: 4, title: 'Seller Guide', icon: BookOpen, href: '/seller/guide' },
        ];
    }

    if (role === 'ROLE_CUSTOMER') {
        return [
            { id: 1, title: 'Dashboard', icon: LayoutDashboard, href: '/customer/dashboard' },
            { id: 2, title: 'My Orders', icon: ShoppingBag, href: '/customer/orders' },
            { id: 3, title: 'Returns', icon: FileText, href: '/customer/returns' },
            { id: 4, title: 'Shop', icon: ShoppingCart, href: '/products' },
        ];
    }



    return common;
};
