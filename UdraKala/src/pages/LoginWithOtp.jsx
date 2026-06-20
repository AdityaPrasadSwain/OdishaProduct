import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion as Motion } from 'motion/react';
import Swal from 'sweetalert2';
import API from '../api/axios'; // Direct API for OTP requests

const LoginWithOtp = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Keeping for context, though manual token set is used below per previous logic

    const [loginType, setLoginType] = useState('EMAIL'); // EMAIL or MOBILE
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Request, 2: Verify
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    // Cooldown Timer
    useEffect(() => {
        let interval;
        if (cooldown > 0) {
            interval = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [cooldown]);

    const handleRequestOtp = async (e) => {
        if (e) e.preventDefault();

        let identifier;
        if (loginType === 'EMAIL') {
            if (!email.trim()) {
                Swal.fire({ text: 'Please enter your email', icon: 'warning', confirmButtonColor: '#5747C7' });
                return;
            }
            identifier = email;
        } else {
            if (!mobile.trim() || mobile.length < 10) {
                Swal.fire({ text: 'Please enter a valid mobile number', icon: 'warning', confirmButtonColor: '#5747C7' });
                return;
            }
            identifier = mobile;
        }

        setLoading(true);
        try {
            await API.post('/auth/login/request-otp', {
                loginType,
                email: loginType === 'EMAIL' ? email : undefined,
                mobile: loginType === 'MOBILE' ? mobile : undefined
            });
            setStep(2);
            setCooldown(30); // 30s cooldown as per requirements
            Swal.fire({
                text: `OTP sent to your ${loginType === 'EMAIL' ? 'email' : 'mobile number'}`,
                icon: 'success',
                confirmButtonColor: '#5747C7',
                timer: 1500
            });
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to send OTP';
            // Check for cooldown message to update timer if needed, though server checks it too
            Swal.fire({ text: msg, icon: 'error', confirmButtonColor: '#5747C7' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp.trim() || otp.length !== 6) {
            Swal.fire({ text: 'Invalid OTP', icon: 'warning', confirmButtonColor: '#5747C7' });
            return;
        }

        setLoading(true);
        try {
            const res = await API.post('/auth/login/verify-otp', {
                loginType,
                email: loginType === 'EMAIL' ? email : undefined,
                mobile: loginType === 'MOBILE' ? mobile : undefined,
                otp
            });

            // Login Success
            const rawRoles = res.data.roles || [];
            const normalizedRoles = rawRoles.map(r => r.startsWith('ROLE_') ? r : `ROLE_${r}`);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify({
                id: res.data.id,
                email: res.data.email,
                roles: normalizedRoles,
                fullName: res.data.fullName,
                shopName: res.data.shopName,
                isApproved: res.data.isApproved
            }));

            // Force reload to update AuthContext state from localStorage
            window.location.href = '/';

        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid OTP';
            Swal.fire({ text: msg, icon: 'error', confirmButtonColor: '#5747C7' });
            if (msg.includes('exceeded')) {
                setStep(1);
                setOtp('');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-bg-page dark:bg-bg-dark transition-colors duration-300 py-12">
            {/* Background Effects */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary-light/30 dark:bg-primary-hover/40 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-primary/20 dark:bg-primary/30 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />

            <div className="max-w-md w-full px-4 relative z-10">
                <Motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-bg-surface/80 dark:bg-bg-surface/10 backdrop-blur-xl border border-border dark:border-transparent dark:shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-8 rounded-3xl shadow-2xl dark:shadow-none"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-text-primary dark:text-text-onDark mb-2">Login with OTP</h2>
                        <p className="text-text-secondary dark:text-text-secondary text-sm">Secure passwordless access</p>
                    </div>

                    {/* Tabs */}
                    {step === 1 && (
                        <div className="flex p-1 mb-6 bg-bg-band dark:bg-bg-surface/5 rounded-xl">
                            <button
                                onClick={() => setLoginType('EMAIL')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${loginType === 'EMAIL'
                                        ? 'bg-bg-surface dark:bg-bg-dark text-primary shadow-sm'
                                        : 'text-text-secondary hover:text-text-secondary dark:text-text-secondary'
                                    }`}
                            >
                                Email Login
                            </button>
                            <button
                                onClick={() => setLoginType('MOBILE')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${loginType === 'MOBILE'
                                        ? 'bg-bg-surface dark:bg-bg-dark text-primary shadow-sm'
                                        : 'text-text-secondary hover:text-text-secondary dark:text-text-secondary'
                                    }`}
                            >
                                Mobile Login
                            </button>
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleRequestOtp} className="space-y-6">
                            {loginType === 'EMAIL' ? (
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-bg-surface dark:bg-bg-surface/5 border border-border dark:border-transparent dark:shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-text-primary dark:text-text-onDark rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder-gray-400"
                                        placeholder="Enter your registered email"
                                        required
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">Mobile Number</label>
                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        className="w-full bg-bg-surface dark:bg-bg-surface/5 border border-border dark:border-transparent dark:shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-text-primary dark:text-text-onDark rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder-gray-400"
                                        placeholder="Enter your 10-digit mobile number"
                                        required
                                        maxLength={10}
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || cooldown > 0}
                                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-text-onDark font-bold py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Sending...' : cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="text-center mb-4">
                                <span className="text-sm text-text-secondary">
                                    Sent to {loginType === 'EMAIL' ? email : mobile}
                                </span>
                                <button type="button" onClick={() => setStep(1)} className="ml-2 text-primary text-sm hover:underline">Change</button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-2">Enter 6-Digit OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full bg-bg-surface dark:bg-bg-surface/5 border border-border dark:border-transparent dark:shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-text-primary dark:text-text-onDark rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-center tracking-widest text-2xl"
                                    placeholder="000000"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-text-onDark font-bold py-3 rounded-xl shadow-lg disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </button>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={handleRequestOtp}
                                    disabled={cooldown > 0 || loading}
                                    className="text-sm text-text-secondary hover:text-primary disabled:opacity-50 transition-colors"
                                >
                                    {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="text-center mt-6 pt-6 border-t border-border dark:border-transparent dark:shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                        <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary dark:hover:text-text-onDark transition-colors">
                            Back to Password Login
                        </Link>
                    </div>
                </Motion.div>
            </div>
        </div>
    );
};

export default LoginWithOtp;
