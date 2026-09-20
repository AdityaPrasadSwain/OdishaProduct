import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { 
    User, Package, Ticket, Coins, Zap, CreditCard, 
    MapPin, Heart, Gift, Bell, LayoutDashboard, LogOut 
} from 'lucide-react';

export const useAccountMenuItems = (handleLogout) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const isSeller = user?.roles?.includes('ROLE_SELLER');
    const isCustomer = user?.roles?.includes('ROLE_CUSTOMER');
    const isAgent = user?.roles?.includes('ROLE_DELIVERY_AGENT');

    const accountMenuItems = [];
    const dashboards = [];
    
    if (isAdmin) dashboards.push({ label: t('admin_dashboard', 'Admin Dashboard'), icon: LayoutDashboard, to: "/admin/dashboard" });
    if (isSeller) dashboards.push({ label: t('seller_dashboard', 'Seller Dashboard'), icon: LayoutDashboard, to: "/seller/dashboard" });
    if (isAgent) dashboards.push({ label: t('agent_dashboard', 'Agent Dashboard'), icon: LayoutDashboard, to: "/agent/dashboard" });
    if (isCustomer) dashboards.push({ label: t('my_dashboard', 'My Dashboard'), icon: LayoutDashboard, to: "/customer/dashboard" });
    
    if (dashboards.length > 0) {
        accountMenuItems.push({ title: 'DASHBOARDS', items: dashboards });
    }

    accountMenuItems.push({
        title: 'YOUR ACCOUNT',
        items: [
            { label: "My Profile", icon: User, to: "/profile" },
            { label: "Orders", icon: Package, to: "/customer/orders" },
            { label: "Coupons", icon: Ticket, to: "/coupons" },
            { label: "Supercoin", icon: Coins, to: "/supercoin" },
            { label: "UdraKala Plus Zone", icon: Zap, to: "/plus-zone" },
            { label: "Saved Cards & Wallet", icon: CreditCard, to: "/wallet" },
            { label: "Saved Addresses", icon: MapPin, to: "/addresses" },
            { label: "Wishlist", icon: Heart, to: "/wishlist" },
            { label: "Gift Cards", icon: Gift, to: "/gift-cards" },
            { label: "Notifications", icon: Bell, to: "/notifications" },
        ]
    });

    accountMenuItems.push({
        items: [
            { label: "Logout", icon: LogOut, onClick: handleLogout, isDanger: true }
        ]
    });

    return accountMenuItems;
};
