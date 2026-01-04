import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, Truck, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import Card from '../../components/ui/Card';

const PolicyContent = ({ type }) => {
    switch (type) {
        case 'agreement':
            return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Seller Agreement</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        This Seller Agreement ("Agreement") is a legally binding contract between you ("Seller") and UdraKala ("Platform").
                        By registering as a seller, you agree to the following terms:
                    </p>

                    <div className="space-y-4">
                        <section>
                            <h3 className="text-lg font-semibold mb-2">1. Account Registration</h3>
                            <p className="text-sm text-gray-500">
                                You must provide accurate information including GSTIN, PAN, and Bank Details. Use of false information will lead to immediate account suspension.
                            </p>
                        </section>
                        <section>
                            <h3 className="text-lg font-semibold mb-2">2. Commission & Fees</h3>
                            <p className="text-sm text-gray-500">
                                UdraKala charges a fixed commission rate per category + shipping fees. These are automatically deducted from your payout. Rate cards are subject to change with 15 days notice.
                            </p>
                        </section>
                        <section>
                            <h3 className="text-lg font-semibold mb-2">3. Intellectual Property</h3>
                            <p className="text-sm text-gray-500">
                                You represent that you have the right to sell the products listed. Selling counterfeit or unauthorized replicas is strictly prohibited.
                            </p>
                        </section>
                        <section>
                            <h3 className="text-lg font-semibold mb-2">4. Termination</h3>
                            <p className="text-sm text-gray-500">
                                UdraKala reserves the right to terminate your account for violation of policies, high return rates (&gt;20%), or fraudulent activity.
                            </p>
                        </section>
                    </div>
                </div>
            );

        case 'shipping':
            return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Shipping Policy</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Efficient shipping is key to customer satisfaction. Our policy ensures timely delivery and proper handling.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100">
                            <h4 className="font-bold flex items-center gap-2"><Truck size={18} /> Service Level Agreement (SLA)</h4>
                            <p className="text-sm mt-2">Orders must be marked 'Ready to Ship' within <strong>24 hours</strong> of receiving them. Exceptions apply for Sundays and Public Holidays.</p>
                        </Card>
                        <Card className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100">
                            <h4 className="font-bold flex items-center gap-2"><AlertTriangle size={18} /> Packaging Guidelines</h4>
                            <p className="text-sm mt-2">Use widespread bubble wrap for fragile items. Ensure the shipping label is pasted flat on the top surface.</p>
                        </Card>
                    </div>

                    <h3 className="text-lg font-semibold">Penalties</h3>
                    <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                        <li>Late Dispatch: ₹50 per order per day (capped at 2 days).</li>
                        <li>Cancellation (Seller Fault): 100% Commission Fee charged.</li>
                    </ul>
                </div>
            );

        case 'prohibited':
            return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4 text-red-600">Prohibited Items</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        The following items are strictly banned from being listed on UdraKala. Listing these will result in an instant ban.
                    </p>

                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 dark:bg-gray-800 font-semibold">
                                <tr>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td className="p-3 font-medium">Illegal Goods</td>
                                    <td className="p-3 text-gray-500">Drugs, weapons, stolen property, hazardous materials.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Counterfeits</td>
                                    <td className="p-3 text-gray-500">First copies, unauthorized replicas of branded items.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Digital Products</td>
                                    <td className="p-3 text-gray-500">E-books, software keys, pirated media content.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Offensive Material</td>
                                    <td className="p-3 text-gray-500">Hate speech symbols, explicit adult content.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            );

        case 'conduct':
            return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Code of Conduct</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        We expect all our partners to maintain high standards of professionalism and ethics.
                    </p>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="mt-1"><CheckCircle className="text-green-500" /></div>
                            <div>
                                <h4 className="font-bold">Honesty & Integrity</h4>
                                <p className="text-sm text-gray-500">Provide accurate product descriptions and images. Do not mislead customers.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1"><CheckCircle className="text-green-500" /></div>
                            <div>
                                <h4 className="font-bold">Respectful Communication</h4>
                                <p className="text-sm text-gray-500">Treat customers and support staff with respect. Abusive language is not tolerated.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1"><CheckCircle className="text-green-500" /></div>
                            <div>
                                <h4 className="font-bold">Fair Competition</h4>
                                <p className="text-sm text-gray-500">Do not sabotage other sellers or manipulate reviews.</p>
                            </div>
                        </div>
                    </div>
                </div>
            );

        default:
            return <div className="text-center py-20">Policy not found.</div>;
    }
};

const SellerPolicies = () => {
    const { type } = useParams();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto pb-20"
        >
            <div className="mb-6">
                <Link to="/seller/guide" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Back to Guide
                </Link>
            </div>

            <Card className="min-h-[60vh] !p-8">
                <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                    <Shield className="text-blue-600" />
                    <span className="font-semibold text-gray-400 uppercase tracking-widest text-xs">UdraKala Seller Policy</span>
                </div>

                <PolicyContent type={type} />
            </Card>
        </motion.div>
    );
};

export default SellerPolicies;
