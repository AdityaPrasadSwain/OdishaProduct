import { LayoutDashboard, ShoppingBag, Users, FileText, Settings, ShoppingCart, User, Heart } from 'lucide-react';

export const splitRoleItems = (role) => {
    const common = [];

    if (role === 'ROLE_ADMIN') {
        return [
            { id: 1, title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
            { id: 2, title: 'Analytics', icon: FileText, href: '/admin/analytics' },
            { id: 3, title: 'Settings', icon: Settings, href: '#' },
        ];
    }

    if (role === 'ROLE_SELLER') {
        return [
            { id: 1, title: 'Dashboard', icon: LayoutDashboard, href: '/seller/dashboard' },
            { id: 2, title: 'Status', icon: FileText, href: '/seller/status' },
            { id: 3, title: 'Settings', icon: Settings, href: '#' },
        ];
    }

    if (role === 'ROLE_CUSTOMER') {
        return [
            { id: 1, title: 'Dashboard', icon: LayoutDashboard, href: '/customer/dashboard' },
            { id: 2, title: 'My Orders', icon: ShoppingBag, href: '/customer/orders' },
            { id: 3, title: 'Shop', icon: ShoppingCart, href: '/products' },
        ];
    }

    return common;
};
