
import { uniqueId } from 'lodash';

import {
  IconLayoutDashboard, IconUserCircle, IconPackage, IconShoppingCart,
  IconCurrencyDollar, IconBasket, IconUsers, IconSettings, IconCategory,
  IconChartInfographic, IconTruck, IconHistory, IconHeart, IconPlus, IconFiles
} from '@tabler/icons-react';

// --- Seller Menu Items ---
export const SellerMenuItems = [
  {
    navlabel: true,
    subheader: 'Seller Workspace',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    id: uniqueId(),
    title: 'New Product',
    icon: IconPlus,
    href: '/seller/products/create',
  },
  {
    id: uniqueId(),
    title: 'My Drafts',
    icon: IconFiles,
    href: '/seller/drafts',
  },
  {
    id: uniqueId(),
    title: 'Orders',
    icon: IconShoppingCart,
    href: '/seller/orders',
  },
  {
    id: uniqueId(),
    title: 'Payments',
    icon: IconCurrencyDollar,
    href: '/seller/payments',
  },
  {
    navlabel: true,
    subheader: 'Account Settings',
  },
  {
    id: uniqueId(),
    title: 'Shop Profile',
    icon: IconUserCircle,
    href: '/seller/profile',
  },
];

// --- Admin Menu Items ---
export const AdminMenuItems = [
  {
    navlabel: true,
    subheader: 'Admin Portal',
  },
  {
    id: uniqueId(),
    title: 'Overview',
    icon: IconLayoutDashboard,
    href: '/admin/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Sellers List',
    icon: IconUsers,
    href: '/admin/sellers',
  },
  {
    id: uniqueId(),
    title: 'Product Categories',
    icon: IconCategory,
    href: '/admin/categories',
  },
  {
    id: uniqueId(),
    title: 'Platform Analytics',
    icon: IconChartInfographic,
    href: '/admin/analytics',
  },
  {
    navlabel: true,
    subheader: 'System Settings',
  },
  {
    id: uniqueId(),
    title: 'Configurations',
    icon: IconSettings,
    href: '/admin/settings',
  },
];

// --- Buyer Menu Items ---
export const BuyerMenuItems = [
  {
    navlabel: true,
    subheader: 'Marketplace',
  },
  {
    id: uniqueId(),
    title: 'Home',
    icon: IconBasket,
    href: '/',
  },
  {
    id: uniqueId(),
    title: 'Track Orders',
    icon: IconTruck,
    href: '/buyer/orders',
  },
  {
    id: uniqueId(),
    title: 'Purchase History',
    icon: IconHistory,
    href: '/buyer/history',
  },
  {
    id: uniqueId(),
    title: 'Saved Items',
    icon: IconHeart,
    href: '/buyer/wishlist',
  },
  {
    navlabel: true,
    subheader: 'Personal Account',
  },
  {
    id: uniqueId(),
    title: 'User Profile',
    icon: IconUserCircle,
    href: '/buyer/profile',
  },
];

// Default export for backward compatibility
const Menuitems = SellerMenuItems;
export default Menuitems;
