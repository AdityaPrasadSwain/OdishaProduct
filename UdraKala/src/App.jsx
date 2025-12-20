import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerStatus from './pages/seller/SellerStatus';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Unauthorized from './pages/Unauthorized';
import MyOrders from './pages/customer/MyOrders';
import TrackOrder from './pages/customer/TrackOrder';
import Wishlist from './pages/Wishlist';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';

function App() {
  return (
    <>
      <Routes>
        {/* ========== Public Layout Routes ========== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><Wishlist /></ProtectedRoute>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Checkout Flow (Customer only but distinct look, usually keeps Navbar or minimal) */}
          <Route path="/checkout" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><Checkout /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/customer/track-order/:id" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><TrackOrder /></ProtectedRoute>} />
        </Route>

        {/* ========== Dashboard Layout Routes ========== */}
        <Route element={<DashboardLayout />}>
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['ADMIN']}><AnalyticsDashboard /></ProtectedRoute>} />

          {/* Seller Routes */}
          <Route path="/seller/dashboard" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerDashboard /></ProtectedRoute>} />
          <Route path="/seller/status" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerStatus /></ProtectedRoute>} />

          {/* Customer Routes */}
          <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/customer/orders" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><MyOrders /></ProtectedRoute>} />
        </Route>

        {/* ========== Fallback Route ========== */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;

