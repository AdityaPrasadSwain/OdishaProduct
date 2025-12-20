import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion as Motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { sendWelcomeEmail, sendAdminNotification } from '../utils/emailService';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'CUSTOMER',
        shopName: '',
        gstNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        // 1. Full Name
        if (!formData.fullName.trim()) {
            return "Full Name is required.";
        }
        if (formData.fullName.length < 3) {
            return "Full Name must be at least 3 characters long.";
        }
        if (!/^[a-zA-Z\s]*$/.test(formData.fullName)) {
            return "Full Name can contain only letters and spaces.";
        }

        // 2. Email
        if (!formData.email.trim()) {
            return "Email address is required.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            return "Please enter a valid email address.";
        }

        // 3. Password
        if (!formData.password) {
            return "Password is required.";
        }
        if (formData.password.length < 8) {
            return "Password must be at least 8 characters long.";
        }

        // 4. Phone Number
        if (!formData.phoneNumber.trim()) {
            return "Phone number is required.";
        }
        if (!/^\d{10}$/.test(formData.phoneNumber)) {
            return "Please enter a valid 10-digit mobile number.";
        }

        // 5. Account Type
        if (!formData.role) {
            return "Please select an account type.";
        }
        if (!['CUSTOMER', 'SELLER', 'ADMIN'].includes(formData.role)) {
            return "Invalid account type selected.";
        }

        // Seller Specific Validations
        if (formData.role === 'SELLER') {
            // 6. Shop Name
            if (!formData.shopName || !formData.shopName.trim()) {
                return "Shop Name is required for seller accounts.";
            }
            if (formData.shopName.length < 3) {
                return "Shop Name must be at least 3 characters long.";
            }

            // 7. GST Number
            if (!formData.gstNumber || !formData.gstNumber.trim()) {
                return "GST Number is required for seller accounts.";
            }
            if (formData.gstNumber.length !== 15) {
                return "Please enter a valid GST Number.";
            }
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            Swal.fire({
                title: 'Validation Error',
                text: validationError,
                icon: 'error',
                confirmButtonText: 'Fix Now',
                confirmButtonColor: '#ea580c' // Orange-600 to match theme
            });
            return;
        }

        setLoading(true);

        try {
            await register(formData);

            // Send Emails (Service handles errors & alerts)
            await sendWelcomeEmail(formData.email, formData.fullName);
            if (formData.role === 'SELLER') {
                await sendAdminNotification(formData.fullName, formData.email);
            }

            // Success Message
            if (formData.role === 'SELLER') {
                await Swal.fire({
                    title: 'Success!',
                    html: 'Seller account created successfully.<br>your account will be approved within 24–48 hours.', // Using HTML for line break
                    icon: 'success',
                    confirmButtonColor: '#ea580c'
                });
            } else {
                await Swal.fire({
                    title: 'Success!',
                    text: 'Account created successfully. Please login.',
                    icon: 'success',
                    confirmButtonColor: '#ea580c'
                });
            }
            navigate('/login');
        } catch (err) {
            // Backend Error Handling
            const backendMessage = err.response?.data?.message || err.message || "Something went wrong. Please try again later.";
            Swal.fire({
                title: 'Registration Failed',
                text: backendMessage,
                icon: 'error',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#ea580c'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12">
            {/* Background Effects */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-300/30 dark:bg-indigo-900/40 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-orange-400/20 dark:bg-orange-600/30 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />

            <div className="max-w-2xl w-full px-4 relative z-10">
                <Motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 p-8 md:p-10 rounded-3xl shadow-2xl dark:shadow-none transition-all duration-300"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Create Account</h2>
                        <p className="text-gray-600 dark:text-gray-300 transition-colors">Join the community of artisans and connoisseurs</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Full Name</label>
                                <input name="fullName" type="text" value={formData.fullName} onChange={handleChange} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-500/50 transition-all placeholder-gray-400 dark:placeholder-gray-500" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Email</label>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-500/50 transition-all placeholder-gray-400 dark:placeholder-gray-500" placeholder="john@example.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-500/50 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="Min 8 characters"
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Phone</label>
                                <input name="phoneNumber" type="text" value={formData.phoneNumber} onChange={handleChange} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-500/50 transition-all placeholder-gray-400 dark:placeholder-gray-500" placeholder="+91 98765 43210" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Account Type</label>
                            <div className="relative">
                                <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-500/50 transition-all appearance-none cursor-pointer">
                                    <option value="CUSTOMER" className="text-gray-900 dark:text-black">Customer</option>
                                    <option value="SELLER" className="text-gray-900 dark:text-black">Seller</option>
                                    <option value="ADMIN" className="text-gray-900 dark:text-black">Admin (Testing)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>

                        {formData.role === 'SELLER' && (
                            <Motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-6 overflow-hidden"
                            >
                                <div className="p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl transition-colors">
                                    <h3 className="text-orange-600 dark:text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider transition-colors">Seller Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Shop Name</label>
                                            <input name="shopName" type="text" value={formData.shopName} onChange={handleChange} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-400 dark:placeholder-gray-500" placeholder="My Handicrafts" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">GST Number</label>
                                            <input name="gstNumber" type="text" value={formData.gstNumber} onChange={handleChange} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-400 dark:placeholder-gray-500" placeholder="22AAAAA0000A1Z5" />
                                        </div>
                                    </div>
                                </div>
                            </Motion.div>
                        )}

                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-gray-500 dark:text-gray-400 transition-colors">
                                Already have an account?{' '}
                                <Link to="/login" className="text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 font-medium transition ml-1">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </form>
                </Motion.div>
            </div>
        </div>
    );
};

export default Register;
