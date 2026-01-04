import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    BookOpen,
    User,
    Package,
    ShoppingBag,
    DollarSign,
    RotateCcw,
    Shield,
    HelpCircle,
    ChevronDown,
    ChevronRight,
    CheckCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';

const GuideSection = ({ title, icon: Icon, children, isOpen, onToggle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none bg-gradient-to-r from-transparent to-gray-50 dark:to-gray-900/50"
            >
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
                </div>
                {isOpen ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 pt-0 border-t border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Step = ({ number, title, text }) => (
    <div className="flex gap-4 mb-4 last:mb-0">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
            {number}
        </div>
        <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
        </div>
    </div>
);

const SellerGuide = () => {
    const [openSection, setOpenSection] = useState(0);

    const toggleSection = (index) => {
        setOpenSection(openSection === index ? -1 : index);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 shadow-xl"
            >
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-4">Seller Success Guide</h1>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Everything you need to know about growing your business on UdraKala.
                        Master the platform, optimize your sales, and deliver happiness.
                    </p>
                </div>
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl"></div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Areas */}
                <div className="lg:col-span-2">

                    <GuideSection
                        title="Getting Started"
                        icon={User}
                        isOpen={openSection === 0}
                        onToggle={() => toggleSection(0)}
                    >
                        <p className="mb-4">Welcome to the UdraKala family! Setting up your store correctly is the first step to success.</p>
                        <Step number={1} title="Complete Your Profile" text="Ensure your shop name, logo, and bio are attractive. Customers trust clear branding." />
                        <Step number={2} title="KYC Verification" text="Upload your GSTIN and PAN card in the 'Status' or 'KYC' section to activate payments." />
                        <Step number={3} title="Bank Details" text="Add your bank account info in the 'Settlements' tab to receive timely payouts." />
                    </GuideSection>

                    <GuideSection
                        title="Product Management"
                        icon={Package}
                        isOpen={openSection === 1}
                        onToggle={() => toggleSection(1)}
                    >
                        <p className="mb-4">Great products with clear details sell faster. Learn how to list effectively.</p>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                            <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Image Guidelines</h5>
                            <p className="text-sm">Use high-quality square images (1080x1080px). White or solid backgrounds perform best. You can upload up to 8 images per product.</p>
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-sm ml-2">
                            <li>Go to <strong>Dashboard &gt; Products</strong> tab.</li>
                            <li>Click "Add Product" and fill in all mandatory fields.</li>
                            <li>Use our <strong>AI Generate</strong> button to create catchy descriptions automatically.</li>
                            <li>Use accurate inventory numbers to avoid out-of-stock cancellations.</li>
                        </ul>
                    </GuideSection>

                    <GuideSection
                        title="Order Fulfillment"
                        icon={ShoppingBag}
                        isOpen={openSection === 2}
                        onToggle={() => toggleSection(2)}
                    >
                        <p className="mb-4">Timely dispatch impacts your seller rating. Follow this flow:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="!p-4 border border-gray-100 shadow-none bg-gray-50 dark:bg-gray-800">
                                <span className="text-xs font-bold text-yellow-600 uppercase tracking-wide">Step 1</span>
                                <h4 className="font-bold">Accept Order</h4>
                                <p className="text-xs mt-1">Review the new order in the 'Orders' tab and mark it as <strong>Accepted/Processing</strong>.</p>
                            </Card>
                            <Card className="!p-4 border border-gray-100 shadow-none bg-gray-50 dark:bg-gray-800">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Step 2</span>
                                <h4 className="font-bold">Pack & Label</h4>
                                <p className="text-xs mt-1">Pack securely. Generate and print the <strong>Shipping Label</strong> from the dashboard.</p>
                            </Card>
                            <Card className="!p-4 border border-gray-100 shadow-none bg-gray-50 dark:bg-gray-800">
                                <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">Step 3</span>
                                <h4 className="font-bold">Handover</h4>
                                <p className="text-xs mt-1">Hand over the package to our pickup agent and mark status as <strong>Shipped</strong>.</p>
                            </Card>
                        </div>
                    </GuideSection>

                    <GuideSection
                        title="Payments & Wallet"
                        icon={DollarSign}
                        isOpen={openSection === 3}
                        onToggle={() => toggleSection(3)}
                    >
                        <p>We believe in transparent and fast payments.</p>
                        <div className="mt-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle size={18} className="text-green-500 mt-0.5" />
                                <div>
                                    <h5 className="font-medium text-sm">Payment Cycle</h5>
                                    <p className="text-xs text-gray-500">Payments are processed every <strong>Wednesday</strong> for all orders delivered up to the previous Sunday.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle size={18} className="text-green-500 mt-0.5" />
                                <div>
                                    <h5 className="font-medium text-sm">Net Earnings</h5>
                                    <p className="text-xs text-gray-500">Commission and shipping fees are deducted automatically. Check 'Pending Earnings' in the Wallet tab.</p>
                                </div>
                            </div>
                        </div>
                    </GuideSection>

                    <GuideSection
                        title="Returns & Disputes"
                        icon={RotateCcw}
                        isOpen={openSection === 4}
                        onToggle={() => toggleSection(4)}
                    >
                        <p className="mb-2">Minimize returns by providing accurate descriptions and size charts.</p>
                        <p className="text-sm text-gray-500 mb-4">You have 48 hours to approve or reject a return request. If you suspect fraud, reject the return with a clear reason and photo evidence if possible.</p>
                        <div className="text-sm p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded border border-red-100 dark:border-red-900/30">
                            <strong>Note:</strong> Excessive rejections without valid proof may lead to account penalties.
                        </div>
                    </GuideSection>

                </div>

                {/* Sidebar / Quick Links */}
                <div className="space-y-6">
                    <Card className="!border-t-4 !border-t-primary">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/10 rounded-full text-primary">
                                <HelpCircle size={20} />
                            </div>
                            <h3 className="font-semibold text-lg">Need Help?</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Our support team is available Mon-Sat (9 AM - 7 PM).
                        </p>
                        <button className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
                            Contact Support
                        </button>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
                                <Shield size={20} />
                            </div>
                            <h3 className="font-semibold text-lg">Policies</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><Link to="/seller/policy/agreement" className="hover:text-primary hover:underline">Seller Agreement</Link></li>
                            <li><Link to="/seller/policy/shipping" className="hover:text-primary hover:underline">Shipping Policy</Link></li>
                            <li><Link to="/seller/policy/prohibited" className="hover:text-primary hover:underline">Prohibited Items</Link></li>
                            <li><Link to="/seller/policy/conduct" className="hover:text-primary hover:underline">Code of Conduct</Link></li>
                        </ul>
                    </Card>

                    <div className="bg-indigo-900 rounded-xl p-6 text-white text-center">
                        <h3 className="font-bold text-xl mb-2">Grow Faster! 🚀</h3>
                        <p className="text-indigo-200 text-sm mb-4">Top sellers upload at least 5 new products every week.</p>
                        <button className="bg-white text-indigo-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors shadow">
                            Add Product Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerGuide;
