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
import AdminSettlements from './pages/admin/AdminSettlements'; // New Import
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminUserManagement from './pages/admin/AdminUserManagement'; // New Import
import AdminWalletLedger from './pages/admin/AdminWalletLedger'; // New Import
import AdminAgentPayouts from './pages/admin/AdminAgentPayouts'; // New Import
import AdminAccountingLayout from './pages/admin/accounting/AdminAccountingLayout'; // New Import

import AdminSellersList from './pages/admin/verification/AdminSellersList';
import AdminSellerDetails from './pages/admin/verification/AdminSellerDetails';
import AdminAgentManager from './pages/admin/shipment/AdminAgentManager'; // New Import
import AdminCategories from './pages/admin/AdminCategories';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerStatus from './pages/seller/SellerStatus';
import SellerAnalyticsDashboard from './pages/seller/SellerAnalyticsDashboard';
import SellerProfileView from './pages/seller/SellerProfileView'; // New Import
import SellerSettlements from './pages/seller/SellerSettlements'; // New Import
import SellerGuide from './pages/seller/SellerGuide'; // New Import
import SellerPolicies from './pages/seller/SellerPolicies'; // New Import
import SellerKycFlow from './components/kyc/SellerKycFlow'; // Added Import
import ProductWizard from './pages/seller/product/ProductWizard'; // Added ProductWizard

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
import TrackingPage from './pages/public/TrackingPage';
import ReturnRequestForm from './pages/returns/ReturnRequestForm';
import CustomerReturns from './pages/returns/CustomerReturns';
import ReturnRequestCenter from './pages/returns/wizard/ReturnRequestCenter';
import SellerReturnDashboard from './pages/seller/SellerReturnDashboard';
import AdminReturnManagement from './pages/admin/AdminReturnManagement';
import AdminShipmentManager from './pages/admin/shipment/AdminShipmentManager';
import ProofRequestManager from './pages/admin/shipment/ProofRequestManager'; // New Import
// ... imports
import DeliveryDashboard from './pages/agent/DeliveryDashboard'; // Updated Import
import MyProofs from './pages/agent/MyProofs'; // New Import
import DeliveryAgentUploadProof from './pages/agent/DeliveryAgentUploadProof';
import AdminProofList from './pages/admin/shipment/AdminProofList';
import SellerRequestProof from './pages/seller/SellerRequestProof';
import SellerApprovedProofs from './pages/seller/SellerApprovedProofs';
function App() {
  return (
    <Routes>
      {/* ... existing routes ... */}
      {/* Agent Routes */}

      {/* ... remaining routes ... */}
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
        <Route path="/track/:id" element={<TrackingPage />} />
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
        <Route path="/admin/shipments" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminShipmentManager /></ProtectedRoute>} />
        <Route path="/admin/agents" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAgentManager /></ProtectedRoute>} />
        <Route path="/admin/proof-requests" element={<ProtectedRoute allowedRoles={['ADMIN']}><ProofRequestManager /></ProtectedRoute>} />
        <Route path="/admin/delivery-proofs" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProofList /></ProtectedRoute>} />
        <Route path="/admin/returns" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminReturnManagement /></ProtectedRoute>} />
        <Route path="/admin/returns" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminReturnManagement /></ProtectedRoute>} />

        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['ADMIN']}><AnalyticsDashboard /></ProtectedRoute>} />
        <Route path="/admin/payouts" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminPayoutDashboard /></ProtectedRoute>} />
        <Route path="/admin/settings/commission" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCommissionSettings /></ProtectedRoute>} />
        <Route path="/admin/settings/commission" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCommissionSettings /></ProtectedRoute>} />
        <Route path="/admin/payouts/history" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminPayoutHistory /></ProtectedRoute>} />
        <Route path="/admin/settlements" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminSettlements /></ProtectedRoute>} />
        <Route path="/admin/wallet/ledger" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminWalletLedger /></ProtectedRoute>} />
        <Route path="/admin/agent/payouts" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAgentPayouts /></ProtectedRoute>} />
        <Route path="/admin/accounting" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAccountingLayout /></ProtectedRoute>} />

        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerDashboard /></ProtectedRoute>} />
        <Route path="/seller/dashboard/analytics" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerAnalyticsDashboard /></ProtectedRoute>} />
        <Route path="/seller/dashboard/analytics" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerAnalyticsDashboard /></ProtectedRoute>} />
        <Route path="/seller/returns" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerReturnDashboard /></ProtectedRoute>} />
        <Route path="/seller/status" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerStatus /></ProtectedRoute>} />
        <Route path="/seller/proof-requests" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerRequestProof /></ProtectedRoute>} />
        <Route path="/seller/approved-proofs" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerApprovedProofs /></ProtectedRoute>} />
        <Route path="/seller/profile" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerProfileView /></ProtectedRoute>} />
        <Route path="/seller/settlements" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerSettlements /></ProtectedRoute>} />
        <Route path="/seller/guide" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerGuide /></ProtectedRoute>} />
        <Route path="/seller/policy/:type" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerPolicies /></ProtectedRoute>} />
        <Route path="/seller/products/create" element={<ProtectedRoute allowedRoles={['SELLER']}><ProductWizard /></ProtectedRoute>} />
        <Route path="/seller/kyc" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER']}><SellerKycFlow /></ProtectedRoute>} />

        {/* Agent Routes */}
        <Route path="/agent/dashboard" element={<ProtectedRoute allowedRoles={['DELIVERY_AGENT']}><DeliveryDashboard /></ProtectedRoute>} />
        <Route path="/agent/proofs" element={<ProtectedRoute allowedRoles={['DELIVERY_AGENT']}><MyProofs /></ProtectedRoute>} />
        <Route path="/agent/upload-proof" element={<ProtectedRoute allowedRoles={['DELIVERY_AGENT']}><DeliveryAgentUploadProof /></ProtectedRoute>} />

        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/customer/orders" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><MyOrders /></ProtectedRoute>} />
        <Route path="/customer/returns" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerReturns /></ProtectedRoute>} />
        <Route path="/customer/returns/create" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ReturnRequestForm /></ProtectedRoute>} />
        <Route path="/return-request" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ReturnRequestCenter /></ProtectedRoute>} />

        {/* Shared Routes */}
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['ADMIN', 'SELLER', 'CUSTOMER', 'DELIVERY_AGENT']}><Profile /></ProtectedRoute>} />
      </Route>

      {/* ========== Fallback Route ========== */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}


export default App;
