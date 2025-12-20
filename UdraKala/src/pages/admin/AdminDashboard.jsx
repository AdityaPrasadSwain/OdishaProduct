import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Trash2,
    Search,
    ShoppingBag,
    Users,
    Package,
    Layers
} from 'lucide-react';
import API from '../../api/api';
import Swal from 'sweetalert2';
import { sendSellerApprovalEmail } from '../../utils/emailService';
import AnalyticsDashboard from './AnalyticsDashboard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import StatsCard from '../../components/admin/StatsCard';
import AdminTable from '../../components/admin/AdminTable';
import ScrollReveal from '../../components/ui/ScrollReveal';

const AdminDashboard = () => {
    // Local state for admin data
    const [products, setProducts] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [features, setFeatures] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const prodRes = await API.get('/admin/products');
                setProducts(prodRes.data || []);
                const sellerRes = await API.get('/admin/sellers');
                setSellers(sellerRes.data || []);
                const catRes = await API.get('/categories');
                setCategories(catRes.data || []);
                const featRes = await API.get('/features');
                setFeatures(featRes.data || []);
            } catch (err) {
                console.error("Failed to fetch admin dashboard data", err);
            }
        };
        fetchData();
    }, []);

    // Form States
    const [catName, setCatName] = useState('');
    const [catDesc, setCatDesc] = useState('');
    const [featName, setFeatName] = useState('');
    const [featDesc, setFeatDesc] = useState('');

    // --- Action Handlers (Kept logic same) ---
    const handleApprove = async (id) => {
        try {
            await API.put(`/admin/sellers/${id}/approve`);

            // Find seller to send email
            const seller = sellers.find(s => s.id === id);
            if (seller) {
                // Determine email and name (adjust fields based on object structure)
                const email = seller.email;
                const name = seller.fullName || seller.shopName;
                if (email) {
                    await sendSellerApprovalEmail(email, name);
                }
            }

            setSellers(prev => prev.map(s => s.id === id ? { ...s, approved: true } : s));
            Swal.fire({ icon: 'success', title: 'Seller Approved!', timer: 1500, showConfirmButton: false });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Failed' });
        }
    };
    const handleBlock = async (id) => { try { await API.put(`/admin/sellers/${id}/block`); setSellers(prev => prev.map(s => s.id === id ? { ...s, blocked: true } : s)); Swal.fire({ icon: 'warning', title: 'Seller Blocked!', timer: 1500, showConfirmButton: false }); } catch (error) { Swal.fire({ icon: 'error', title: 'Failed' }); } };
    const handleUnblock = async (id) => { try { await API.put(`/admin/sellers/${id}/unblock`); setSellers(prev => prev.map(s => s.id === id ? { ...s, blocked: false } : s)); Swal.fire({ icon: 'success', title: 'Seller Unblocked!', timer: 1500, showConfirmButton: false }); } catch (error) { Swal.fire({ icon: 'error', title: 'Failed' }); } };
    const handleDeleteSeller = async (id) => { try { await API.delete(`/admin/sellers/${id}`); setSellers(prev => prev.filter(s => s.id !== id)); Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false }); } catch (error) { Swal.fire({ icon: 'error', title: 'Failed' }); } };

    const handleProductApprove = async (id) => { try { await API.put(`/admin/products/${id}/approve`); setProducts(current => current.map(p => p.id === id ? { ...p, approved: true } : p)); Swal.fire({ icon: 'success', title: 'Approved!', timer: 1500, showConfirmButton: false }); } catch (error) { } };
    const handleProductUnapprove = async (id) => { try { await API.put(`/admin/products/${id}/unapprove`); setProducts(current => current.map(p => p.id === id ? { ...p, approved: false } : p)); Swal.fire({ icon: 'success', title: 'Unapproved!', timer: 1500, showConfirmButton: false }); } catch (error) { } };
    const handleProductReject = async (id) => { try { await API.delete(`/admin/products/${id}/reject`); setProducts(current => current.filter(p => p.id !== id)); Swal.fire({ icon: 'success', title: 'Rejected!', timer: 1500, showConfirmButton: false }); } catch (error) { } };

    const handleAddCategory = async (e) => { e.preventDefault(); try { const res = await API.post('/categories', { name: catName, description: catDesc }); setCategories([...categories, res.data]); setCatName(''); setCatDesc(''); Swal.fire({ icon: 'success', title: 'Added!', timer: 1500, showConfirmButton: false }); } catch (error) { Swal.fire({ icon: 'error', title: 'Failed' }); } };
    const handleAddFeature = async (e) => { e.preventDefault(); try { const res = await API.post('/features', { name: featName, description: featDesc }); setFeatures([...features, res.data]); setFeatName(''); setFeatDesc(''); Swal.fire({ icon: 'success', title: 'Added!', timer: 1500, showConfirmButton: false }); } catch (ERROR) { Swal.fire({ icon: 'error', title: 'Failed' }); } };
    const handleDeleteCategory = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Category?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            try {
                await API.delete(`/categories/${id}`);
                setCategories(categories.filter(c => c.id !== id));
                Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
            } catch (error) {
                console.error("Delete failed", error);
                const msg = error.response?.data || 'Failed to delete category';
                Swal.fire({ icon: 'error', title: 'Error', text: msg });
            }
        }
    };

    // --- Table Configurations ---
    const sellerColumns = [
        { header: "Seller Name" }, { header: "Shop Name" }, { header: "Status" }, { header: "Action", className: "text-right" }
    ];
    const productColumns = [
        { header: "Product" }, { header: "Category" }, { header: "Price" }, { header: "Status" }, { header: "Action", className: "text-right" }
    ];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif">Admin Dashboard</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your platform efficiently.</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
                    {['overview', 'sellers', 'products', 'categories', 'features'].map(tab => (
                        <motion.button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap
                                ${activeTab === tab
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {tab}
                        </motion.button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard title="Total Sellers" value={sellers.length} icon={Users} color="blue" trend="up" trendValue={5} />
                            <StatsCard title="Total Products" value={products.length} icon={Package} color="purple" trend="up" trendValue={12} />
                            <StatsCard title="Categories" value={categories.length} icon={Layers} color="orange" />
                            <StatsCard title="Active Orders" value={156} icon={ShoppingBag} color="green" trend="up" trendValue={8} /> {/* Mock value for orders */}
                        </div>

                        {/* Analytics Component */}
                        <AnalyticsDashboard />
                    </motion.div>
                )}

                {activeTab === 'sellers' && (
                    <motion.div key="sellers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Card title="Sellers Management">
                            <AdminTable
                                columns={sellerColumns}
                                data={sellers}
                                renderRow={(seller) => (
                                    <>
                                        <td className="p-4 text-dark dark:text-white font-medium">{seller.fullName}</td>
                                        <td className="p-4 text-muted">{seller.shopName}</td>
                                        <td className="p-4">
                                            <Badge variant={seller.approved ? (seller.blocked ? 'danger' : 'success') : 'warning'}>
                                                {seller.approved ? (seller.blocked ? 'Blocked' : 'Verified') : 'Pending'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!seller.approved && <Button size="sm" variant="success" onClick={() => handleApprove(seller.id)}><CheckCircle size={16} /></Button>}
                                                {seller.approved && seller.blocked && <Button size="sm" variant="success" onClick={() => handleUnblock(seller.id)}><CheckCircle size={16} /></Button>}
                                                {(!seller.blocked && seller.approved) && <Button size="sm" variant="warning" onClick={() => handleBlock(seller.id)}><AlertCircle size={16} /></Button>}
                                                <Button size="sm" variant="danger" onClick={() => handleDeleteSeller(seller.id)}><Trash2 size={16} /></Button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            />
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'products' && (
                    <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Card title="Product Management">
                            <AdminTable
                                columns={productColumns}
                                data={products}
                                renderRow={(product) => {
                                    const isApproved = product.approved || product.isApproved;
                                    return (
                                        <>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 dark:bg-dark-light">
                                                        {product.imageUrls?.[0] && <img className="h-full w-full object-cover" src={product.imageUrls[0]} alt="" />}
                                                    </div>
                                                    <span className="font-medium text-dark dark:text-white truncate max-w-[150px]">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-muted">{product.category?.name || 'Uncategorized'}</td>
                                            <td className="p-4 font-semibold text-dark dark:text-white">₹{product.price}</td>
                                            <td className="p-4"><Badge variant={isApproved ? 'success' : 'warning'}>{isApproved ? 'Active' : 'Pending'}</Badge></td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!isApproved ? (
                                                        <>
                                                            <Button size="sm" variant="success" onClick={() => handleProductApprove(product.id)}><CheckCircle size={16} /></Button>
                                                            <Button size="sm" variant="danger" onClick={() => handleProductReject(product.id)}><XCircle size={16} /></Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button size="sm" variant="warning" onClick={() => handleProductUnapprove(product.id)}><AlertCircle size={16} /></Button>
                                                            <Button size="sm" variant="ghost" onClick={() => handleProductReject(product.id)} className="text-danger hover:bg-danger-light"><Trash2 size={16} /></Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    );
                                }}
                            />
                        </Card>
                    </motion.div>
                )}

                {activeTab === 'categories' && (
                    <motion.div key="categories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <Card title="Add Category">
                                    <form onSubmit={handleAddCategory} className="space-y-4">
                                        <Input label="Name" value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Silk Sarees" required />
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-dark dark:text-white">Description</label>
                                            <textarea value={catDesc} onChange={(e) => setCatDesc(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-dark border border-border dark:border-muted rounded-md text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" rows="4" placeholder="Description..." />
                                        </div>
                                        <Button type="submit" className="w-full">Add Category</Button>
                                    </form>
                                </Card>
                            </div>
                            <div className="md:col-span-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {categories.map((cat, idx) => (
                                        <Card key={cat.id || idx} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary relative group">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-lg text-dark dark:text-white">{cat.name}</h4>
                                                    <p className="text-muted text-sm mt-1 line-clamp-2">{cat.description || "No description"}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                    title="Delete Category"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'features' && (
                    <motion.div key="features" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <Card title="Add Feature">
                                    <form onSubmit={handleAddFeature} className="space-y-4">
                                        <Input label="Name" value={featName} onChange={(e) => setFeatName(e.target.value)} placeholder="e.g. Handwoven" required />
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-dark dark:text-white">Description</label>
                                            <textarea value={featDesc} onChange={(e) => setFeatDesc(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-dark border border-border dark:border-muted rounded-md text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" rows="4" placeholder="Description..." />
                                        </div>
                                        <Button type="submit" className="w-full">Add Feature</Button>
                                    </form>
                                </Card>
                            </div>
                            <div className="md:col-span-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {features.map((f, idx) => (
                                        <Card key={idx} className="hover:shadow-lg transition-shadow border-l-4 border-l-secondary">
                                            <h4 className="font-bold text-lg text-dark dark:text-white">{f.name}</h4>
                                            <p className="text-muted text-sm mt-1 line-clamp-2">{f.description || "No description"}</p>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
