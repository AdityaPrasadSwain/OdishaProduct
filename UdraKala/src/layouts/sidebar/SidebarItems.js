import { LayoutDashboard, ShoppingBag, Users, FileText, Settings, ShoppingCart, User, Heart, Truck, BookOpen, BadgeIndianRupee } from 'lucide-react';

export const splitRoleItems = (role) => {
    const common = [];

    if (role === 'ROLE_ADMIN') {
        return [
            { id: 1, title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
            { id: 2, title: 'Analytics', icon: FileText, href: '/admin/analytics' },
            { id: 4, title: 'Shipments', icon: Truck, href: '/admin/shipments' },
            { id: 8, title: 'Proof Requests', icon: FileText, href: '/admin/proof-requests' },
            { id: 6, title: 'Delivery Agents', icon: Users, href: '/admin/agents' },
            { id: 3, title: 'Users', icon: Users, href: '/admin/users' },
            { id: 7, title: 'Accounting', icon: BadgeIndianRupee, href: '/admin/accounting' },
            { id: 5, title: 'Settings', icon: Settings, href: '#' },
        ];
    }

    if (role === 'ROLE_SELLER') {
        return [
            { id: 1, title: 'Dashboard', icon: LayoutDashboard, href: '/seller/dashboard' },
            { id: 2, title: 'Status', icon: FileText, href: '/seller/status' },
            { id: 5, title: 'Proof Requests', icon: FileText, href: '/seller/proof-requests' },
            { id: 6, title: 'Approved Proofs', icon: FileText, href: '/seller/approved-proofs' },
            { id: 3, title: 'Profile', icon: User, href: '/seller/profile' },
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

    if (role === 'ROLE_DELIVERY_AGENT') {
        return [
            { id: 1, title: 'Dashboard', icon: LayoutDashboard, href: '/agent/dashboard' },
            { id: 3, title: 'Upload Proof', icon: FileText, href: '/agent/upload-proof' },
            { id: 2, title: 'Profile', icon: User, href: '/profile' },
        ];
    }

    return common;
};
