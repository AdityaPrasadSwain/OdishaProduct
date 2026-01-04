import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PublicRoute - Redirects authenticated users away from public-only pages
 * Used for Login and Register pages to prevent logged-in users from accessing them
 */
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // If user is already logged in, redirect to appropriate dashboard
    if (user && !user.isBlocked) {
        const roles = user.roles || [];

        // Redirect based on role
        if (roles.some(r => r.includes('ADMIN'))) {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (roles.some(r => r.includes('DELIVERY_AGENT') || r.includes('AGENT'))) {
            return <Navigate to="/agent/dashboard" replace />;
        } else if (roles.some(r => r.includes('SELLER'))) {
            return <Navigate to="/seller/dashboard" replace />;
        } else if (roles.some(r => r.includes('CUSTOMER'))) {
            return <Navigate to="/customer/dashboard" replace />;
        }

        // Default redirect to home
        return <Navigate to="/" replace />;
    }

    // User is not logged in, show the public page (login/register)
    return children;
};

export default PublicRoute;
