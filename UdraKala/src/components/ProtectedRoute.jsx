import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles, role }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    const token = localStorage.getItem('token');

    // 1. Not Authenticated - Redirect to login
    if (!user || !token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Check if user is blocked
    if (user.isBlocked) {
        localStorage.clear();
        return <Navigate to="/login" state={{ message: 'Your account has been blocked' }} replace />;
    }

    // 3. New: Check if Seller is Approved
    // If user is a seller, checks checks should happen here.
    // If they are unapproved and trying to access anything OTHER than /seller/status, redirect them.
    // Normalized check:
    const userRoles = user.roles || [];
    const isSeller = userRoles.some(r => r.includes('SELLER'));

    if (isSeller && !user.isApproved) {
        // If they are NOT already on the status page, send them there.
        if (location.pathname !== '/seller/status') {
            return <Navigate to="/seller/status" replace />;
        }
    }
    // If they ARE approved, or not a seller, they shouldn't be on /seller/status (optional, but good UX)
    if (isSeller && user.isApproved && location.pathname === '/seller/status') {
        return <Navigate to="/seller/dashboard" replace />;
    }

    // 3. Normalize Allowed Roles
    // Support both 'allowedRoles' prop (array) and legacy 'role' prop (string)
    let requiredRoles = [];
    if (allowedRoles && allowedRoles.length > 0) {
        requiredRoles = allowedRoles;
    } else if (role) {
        requiredRoles = [role];
    }

    // 4. Normalize User Roles
    // userRoles is already defined above
    // const userRoles = user.roles || [];

    // Create a set of user roles without "ROLE_" prefix for easy comparison
    const normalizedUserRoles = new Set();
    userRoles.forEach(r => {
        const cleanRole = r.replace('ROLE_', '').toUpperCase();
        normalizedUserRoles.add(cleanRole);
    });

    // 5. Role Check
    // If no specific roles required, just being logged in is enough
    if (requiredRoles.length === 0) {
        return children;
    }

    // Check if user has ANY of the required roles
    const hasPermission = requiredRoles.some(req =>
        normalizedUserRoles.has(req.toUpperCase())
    );

    if (!hasPermission) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
