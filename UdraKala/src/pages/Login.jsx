import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { motion as Motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ identifier: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = await login(form.identifier, form.password);

            // DEBUG: Log user object and roles
            console.log('Login User Object:', user);
            const userRoles = user.roles || [];
            console.log('Login Roles:', userRoles);

            const isDeliveryAgent = userRoles.some(r => {
                const roleStr = String(r).toUpperCase();
                return roleStr.includes('DELIVERY_AGENT') || roleStr.includes('AGENT');
            });

            if (userRoles.some(r => String(r).includes('ADMIN'))) {
                console.log('Redirecting to Admin Dashboard');
                navigate('/admin/dashboard');
            } else if (isDeliveryAgent) {
                console.log('Redirecting to Agent Dashboard');
                navigate('/agent/dashboard');
            } else if (userRoles.some(r => String(r).includes('SELLER'))) {
                if (user.isApproved) {
                    navigate('/seller/dashboard');
                } else {
                    navigate('/seller/status');
                }
            } else {
                console.log('Redirecting to Customer Dashboard (Default)');
                navigate('/customer/dashboard');
            }

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text:
                    err?.response?.data?.message ||
                    err?.message ||
                    'Invalid credentials'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-400/20 dark:bg-orange-600/30 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-900/40 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />

            <div className="max-w-md w-full px-4 relative z-10">
                <Motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 p-8 rounded-2xl shadow-2xl dark:shadow-none transition-all duration-300"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Welcome Back</h2>
                        <p className="text-gray-600 dark:text-gray-300 transition-colors">Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Email or Mobile</label>
                            <input
                                name="identifier"
                                placeholder="Enter your credentials"
                                value={form.identifier}
                                onChange={handleChange}
                                required
                                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="flex justify-center mt-4">
                            <Link to="/login-otp" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
                                Login with OTP
                            </Link>
                        </div>

                        <div className="text-center mt-6">
                            <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 font-medium transition-colors">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </form>
                </Motion.div>
            </div>
        </div>
    );
};

export default Login;
