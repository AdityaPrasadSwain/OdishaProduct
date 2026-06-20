import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { motion as Motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ identifier: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

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
            if (['INVALID_CREDENTIALS', 'ACCOUNT_NOT_VERIFIED', 'ACCOUNT_DISABLED', 'TOO_MANY_ATTEMPTS', 'VALIDATION_FAILED'].includes(err.errorCode)) {
                setError(err.message);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: err.message || 'Something went wrong'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-bg-page dark:bg-bg-dark transition-colors duration-300">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 dark:bg-primary/30 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-900/40 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />

            <div className="max-w-md w-full px-4 relative z-10">
                <Motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-bg-surface/80 dark:bg-bg-surface/10 backdrop-blur-xl border border-border dark:border-transparent dark:shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-8 rounded-2xl shadow-2xl dark:shadow-none transition-all duration-300"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-text-primary dark:text-text-onDark mb-2 transition-colors">{t('welcome_back')}</h2>
                        <p className="text-text-secondary dark:text-text-secondary transition-colors">{t('sign_in_continue')}</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2 transition-colors">{t('email_or_mobile')}</label>
                            <input
                                name="identifier"
                                placeholder={t('enter_credentials')}
                                value={form.identifier}
                                onChange={handleChange}
                                required
                                className="w-full bg-bg-surface dark:bg-bg-surface/5 border border-border dark:border-transparent dark:shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-text-primary dark:text-text-onDark rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2 transition-colors">{t('password')}</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={t('enter_password')}
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-bg-surface dark:bg-bg-surface/5 border border-border dark:border-transparent dark:shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-text-primary dark:text-text-onDark rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary dark:text-text-secondary hover:text-text-secondary dark:hover:text-text-onDark transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-text-onDark font-bold py-3 rounded-lg shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('signing_in') : t('sign_in')}
                        </button>

                        <div className="flex justify-center mt-4">
                            <Link to="/login-otp" className="text-sm text-text-secondary hover:text-primary transition-colors">
                                {t('login_with_otp')}
                            </Link>
                        </div>

                        <div className="text-center mt-6">
                            <p className="text-text-secondary dark:text-text-secondary text-sm transition-colors">
                                {t('dont_have_account')}{' '}
                                <Link to="/register" className="text-primary dark:text-primary hover:text-primary dark:hover:text-primary font-medium transition-colors">
                                    {t('create_account')}
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
