import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion as Motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';


const Register = () => {
    const navigate = useNavigate();
    const { register, login } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'CUSTOMER',
        shopName: '',
        gstNumber: '',
        profileImage: null
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        if (e.target.name === 'profileImage') {
            const file = e.target.files[0];
            setFormData({ ...formData, profileImage: file });
            if (file) {
                setPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
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
            // Use FormData for file upload
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('phoneNumber', formData.phoneNumber);
            data.append('role', formData.role);
            if (formData.profileImage) {
                data.append('profileImage', formData.profileImage);
            }

            await register(data);

            // Success Message
            await Swal.fire({
                title: 'Success!',
                text: 'Account created! Logging you in...',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            // Auto Login
            const userData = await login(formData.email, formData.password);

            // Redirect based on role
            if (userData.roles.includes('ROLE_ADMIN')) {
                navigate('/admin/dashboard');
            } else if (userData.roles.includes('ROLE_SELLER')) {
                navigate('/seller/dashboard');
            } else {
                navigate('/');
            }
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
                        {/* Profile Photo - New Section */}
                        <div className="flex justify-center mb-6">
                            <div className="relative group">
                                <label htmlFor="profileImage" className="cursor-pointer">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-500 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        {preview ? (
                                            <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sm text-gray-500 text-center px-2">Add Photo</span>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-bold">Change</span>
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    name="profileImage"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="hidden"
                                />
                            </div>
                            <div className="ml-4 flex flex-col justify-center text-sm text-gray-500">
                                <p className="font-medium dark:text-gray-300">Upload a profile photo (optional)</p>
                            </div>
                        </div>
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
                                    {/* Seller registration moved to dedicated page */}
                                    <option value="ADMIN" className="text-gray-900 dark:text-black">Admin (Testing)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Seller Details removed - moved to separate flow */}

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
