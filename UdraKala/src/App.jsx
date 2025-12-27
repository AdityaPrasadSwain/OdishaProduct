import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import LoginWithOtp from './pages/LoginWithOtp';
import SellerRegistrationWizard from './pages/seller-registration/SellerRegistrationWizard';
import Home from './pages/Home';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPayoutDashboard from './pages/admin/AdminPayoutDashboard';
import AdminCommissionSettings from './pages/admin/AdminCommissionSettings';
import AdminPayoutHistory from './pages/admin/AdminPayoutHistory';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminUserManagement from './pages/admin/AdminUserManagement'; // New Import
import AdminSellersList from './pages/admin/verification/AdminSellersList';
import AdminSellerDetails from './pages/admin/verification/AdminSellerDetails';
import AdminCategories from './pages/admin/AdminCategories';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerStatus from './pages/seller/SellerStatus';
import SellerAnalyticsDashboard from './pages/seller/SellerAnalyticsDashboard';
import SellerProfileView from './pages/seller/SellerProfileView'; // New Import
import SellerKycFlow from './components/kyc/SellerKycFlow'; // Added Import
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Unauthorized from './pages/Unauthorized';
import MyOrders from './pages/customer/MyOrders';
import TrackOrder from './pages/customer/TrackOrder';
import WatchReels from './pages/WatchReels';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';
import SellerProfile from './pages/public/SellerProfile';
import ReturnRequestForm from './pages/returns/ReturnRequestForm';
import CustomerReturns from './pages/returns/CustomerReturns';
import SellerReturnDashboard from './pages/seller/SellerReturnDashboard';
import AdminReturnManagement from './pages/admin/AdminReturnManagement';

function App() {
  return (
    <>
      <Routes>
        {/* ========== Public Layout Routes ========== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/reels" element={<WatchReels />} />
          <Route path="/seller/:id" element={<SellerProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><Wishlist /></ProtectedRoute>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/register/seller" element={<PublicRoute><SellerRegistrationWizard /></PublicRoute>} />
          <Route path="/login-otp" element={<PublicRoute><LoginWithOtp /></PublicRoute>} />

          {/* Checkout Flow (Customer only but distinct look, usually keeps Navbar or minimal) */}
          <Route path="/checkout" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><Checkout /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/customer/track-order/:id" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><TrackOrder /></ProtectedRoute>} />
        </Route>

        {/* ========== Dashboard Layout Routes ========== */}
        <Route element={<DashboardLayout />}>
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminNotifications /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUserManagement /></ProtectedRoute>} />
          <Route path="/admin/sellers" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminSellersList /></ProtectedRoute>} />
          <Route path="/admin/sellers/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminSellerDetails /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/returns" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminReturnManagement /></ProtectedRoute>} />

          <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['ADMIN']}><AnalyticsDashboard /></ProtectedRoute>} />
          <Route path="/admin/payouts" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminPayoutDashboard /></ProtectedRoute>} />
          <Route path="/admin/settings/commission" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCommissionSettings /></ProtectedRoute>} />
          <Route path="/admin/payouts/history" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminPayoutHistory /></ProtectedRoute>} />

          {/* Seller Routes */}
          <Route path="/seller/dashboard" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerDashboard /></ProtectedRoute>} />
          <Route path="/seller/dashboard/analytics" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerAnalyticsDashboard /></ProtectedRoute>} />
          <Route path="/seller/dashboard/analytics" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerAnalyticsDashboard /></ProtectedRoute>} />
          <Route path="/seller/returns" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerReturnDashboard /></ProtectedRoute>} />
          <Route path="/seller/status" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerStatus /></ProtectedRoute>} />
          <Route path="/seller/profile" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerProfileView /></ProtectedRoute>} />
          <Route path="/seller/kyc" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER']}><SellerKycFlow /></ProtectedRoute>} />

          {/* Customer Routes */}
          <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/customer/orders" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><MyOrders /></ProtectedRoute>} />
          <Route path="/customer/returns" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerReturns /></ProtectedRoute>} />
          <Route path="/customer/returns/create" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ReturnRequestForm /></ProtectedRoute>} />

          {/* Shared Routes */}
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['ADMIN', 'SELLER', 'CUSTOMER']}><Profile /></ProtectedRoute>} />
        </Route>

        {/* ========== Fallback Route ========== */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
