import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShieldCheck, CreditCard, Truck } from 'lucide-react';

const SocialLink = ({ icon: Icon, href }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-600 transition-all duration-300"
    >
        <Icon size={20} />
    </a>
);

const FooterSection = ({ title, children }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {children}
        </ul>
    </div>
);

const FooterLink = ({ to, children }) => (
    <li>
        <Link to={to} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            {children}
        </Link>
    </li>
);

const Footer = () => {
    const { user } = useAuth();
    const role = user?.roles?.[0] || 'GUEST'; // Simple role check taking the first one or guest

    const isAdmin = role === 'ROLE_ADMIN';
    const isSeller = role === 'ROLE_SELLER';
    const isCustomer = role === 'ROLE_CUSTOMER' || role === 'GUEST';

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            {/* Assuming logo usage or just text */}
                            <span className="text-2xl font-bold text-orange-600 font-serif">UdraKala</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Celebrating the rich heritage of Odisha's handloom and artistry. Bringing authentic craftsmanship directly to your doorstep.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialLink icon={Instagram} href="#" />
                            <SocialLink icon={Facebook} href="#" />
                            <SocialLink icon={Twitter} href="#" />
                        </div>
                    </div>

                    {/* Dynamic Columns based on Role */}

                    {/* Customer / Guest View */}
                    {isCustomer && (
                        <>
                            <FooterSection title="Shop">
                                <FooterLink to="/products?category=saree">Sarees</FooterLink>
                                <FooterLink to="/products?category=textile">Textiles</FooterLink>
                                <FooterLink to="/products?category=handicraft">Handicrafts</FooterLink>
                                <FooterLink to="/products">All Products</FooterLink>
                            </FooterSection>

                            <FooterSection title="Customer Care">
                                <FooterLink to="/track-order">Track Order</FooterLink>
                                <FooterLink to="/shipping-policy">Shipping Policy</FooterLink>
                                <FooterLink to="/returns">Returns & Exchanges</FooterLink>
                                <FooterLink to="/contact">Contact Us</FooterLink>
                            </FooterSection>
                        </>
                    )}

                    {/* Seller View */}
                    {isSeller && (
                        <>
                            <FooterSection title="Seller Hub">
                                <FooterLink to="/seller/dashboard">Dashboard</FooterLink>
                                <FooterLink to="/seller/products">My Products</FooterLink>
                                <FooterLink to="/seller/orders">Orders</FooterLink>
                                <FooterLink to="/seller/payments">Payments</FooterLink>
                            </FooterSection>

                            <FooterSection title="Resources">
                                <FooterLink to="/seller/policy">Seller Policy</FooterLink>
                                <FooterLink to="/seller/guide">Selling Guide</FooterLink>
                                <FooterLink to="/seller/support">Seller Support</FooterLink>
                            </FooterSection>
                        </>
                    )}

                    {/* Admin View */}
                    {isAdmin && (
                        <>
                            <FooterSection title="Administration">
                                <FooterLink to="/admin/dashboard">Dashboard</FooterLink>
                                <FooterLink to="/admin/users">User Management</FooterLink>
                                <FooterLink to="/admin/sellers">Seller Verification</FooterLink>
                            </FooterSection>

                            <FooterSection title="System">
                                <FooterLink to="/admin/settings">Settings</FooterLink>
                                <FooterLink to="/admin/logs">System Logs</FooterLink>
                                <FooterLink to="/admin/reports">Reports</FooterLink>
                            </FooterSection>
                        </>
                    )}

                    {/* Contact Column (Always visible or customized) */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contact Us</h3>
                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="mt-0.5 text-orange-500" />
                                <span>Bhubaneswar, Odisha, India - 751001</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-orange-500" />
                                <span>+91 123 456 7890</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-orange-500" />
                                <span>support@udrakala.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        &copy; {currentYear} UdraKala. All rights reserved.
                    </p>

                    {/* Trust Badges / Info */}
                    {(isCustomer || !user) && (
                        <div className="flex items-center gap-6 text-gray-400 dark:text-gray-600">
                            <div className="flex items-center gap-1">
                                <ShieldCheck size={16} />
                                <span className="text-xs">Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Truck size={16} />
                                <span className="text-xs">Fast Delivery</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
