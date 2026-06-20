import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';

const SocialLink = ({ icon: Icon, href }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-bg-surface dark:bg-bg-dark border border-border dark:border-transparent flex items-center justify-center text-text-secondary hover:bg-primary hover:text-text-onDark hover:border-primary transition-all duration-300 shadow-sm dark:shadow-[0_4px_6px_rgba(0,0,0,0.4)] hover:shadow-md hover:-translate-y-1"
    >
        <Icon size={18} />
    </a>
);

const FooterSection = ({ title, children }) => (
    <div className="space-y-4">
        <h3 className="text-sm font-bold tracking-wider uppercase text-text-primary dark:text-text-onDark">{title}</h3>
        <ul className="space-y-3 text-sm text-text-secondary">
            {children}
        </ul>
    </div>
);

const FooterLink = ({ to, children }) => (
    <li>
        <Link to={to} className="hover:text-primary transition-colors">
            {children}
        </Link>
    </li>
);

const Footer = () => {
    const { user } = useAuth();
    const role = user?.roles?.[0] || 'GUEST';

    const isAdmin = role === 'ROLE_ADMIN';
    const isSeller = role === 'ROLE_SELLER';
    const isCustomer = role === 'ROLE_CUSTOMER' || role === 'GUEST';

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-bg-page dark:bg-bg-dark border-t border-border dark:border-transparent dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    
                    {/* Brand Column (Span 2) */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link to="/" className="inline-block">
                            <span className="text-2xl font-bold font-sans tracking-tight text-text-primary dark:text-text-onDark">
                                Udra<span className="text-primary">Kala</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-text-secondary max-w-sm">
                            Celebrating the rich heritage of Odisha's handlooms and artistry. Bringing authentic craftsmanship directly to your doorstep.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <SocialLink icon={Instagram} href="#" />
                            <SocialLink icon={Facebook} href="#" />
                            <SocialLink icon={Twitter} href="#" />
                        </div>
                    </div>

                    {/* Shop Links */}
                    {isCustomer && (
                        <>
                            <FooterSection title="Shop">
                                <FooterLink to="/products?category=Sarees">Sarees</FooterLink>
                                <FooterLink to="/products?category=Handicraft">Handicrafts</FooterLink>
                                <FooterLink to="/products?category=Textile">Textiles</FooterLink>
                                <FooterLink to="/products">All Products</FooterLink>
                            </FooterSection>

                            <FooterSection title="Help Center">
                                <FooterLink to="/track-order">Track Order</FooterLink>
                                <FooterLink to="/returns">Returns & Exchanges</FooterLink>
                                <FooterLink to="/shipping-policy">Shipping Policy</FooterLink>
                                <FooterLink to="/contact">Contact Support</FooterLink>
                            </FooterSection>
                        </>
                    )}

                    {isSeller && (
                        <>
                            <FooterSection title="Seller Hub">
                                <FooterLink to="/seller/dashboard">Dashboard</FooterLink>
                                <FooterLink to="/seller/products">My Products</FooterLink>
                                <FooterLink to="/seller/orders">Orders</FooterLink>
                            </FooterSection>

                            <FooterSection title="Resources">
                                <FooterLink to="/seller/policy">Seller Policy</FooterLink>
                                <FooterLink to="/seller/guide">Selling Guide</FooterLink>
                            </FooterSection>
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <FooterSection title="Administration">
                                <FooterLink to="/admin/dashboard">Dashboard</FooterLink>
                                <FooterLink to="/admin/users">User Management</FooterLink>
                            </FooterSection>

                            <FooterSection title="System">
                                <FooterLink to="/admin/settings">Settings</FooterLink>
                                <FooterLink to="/admin/logs">System Logs</FooterLink>
                            </FooterSection>
                        </>
                    )}

                    {/* Information Links */}
                    <FooterSection title="Information">
                        <FooterLink to="/about">About Us</FooterLink>
                        <FooterLink to="/sustainability">Sustainability</FooterLink>
                        <FooterLink to="/careers">Careers</FooterLink>
                        <FooterLink to="/press">Press & Media</FooterLink>
                    </FooterSection>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border dark:border-white/5 bg-bg-surface dark:bg-bg-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
                    <p>&copy; {currentYear} UdraKala. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
