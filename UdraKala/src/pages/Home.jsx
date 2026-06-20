import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Truck, ShieldCheck, Headset, RefreshCcw, Tag, ArrowRight } from 'lucide-react';
import ProductCard from '../components/shared/ProductCard';
import SectionHeading from '../components/shared/SectionHeading';
import { useData } from '../context/DataContext';

const CATEGORIES = [
    { label: 'Sarees', icon: Tag },
    { label: 'Textiles', icon: Tag },
    { label: 'Handicrafts', icon: Tag },
    { label: 'Apparel', icon: Tag },
    { label: 'Accessories', icon: Tag },
];

const TRUST_FEATURES = [
    { title: 'Free Shipping', desc: 'On orders over ₹500', icon: Truck },
    { title: 'Secure Payments', desc: '100% protected', icon: ShieldCheck },
    { title: '24/7 Support', desc: 'Dedicated team', icon: Headset },
    { title: 'Easy Returns', desc: '7 days return policy', icon: RefreshCcw },
];

const STORES = [
    { name: 'Odisha Weaves', followers: '1.2k', images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'] },
    { name: 'Kalinga Art', followers: '850', images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'] },
    { name: 'Tribal Craft', followers: '3.4k', images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'] },
];

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { products, loading } = useData();

    // Recommended products (just first 8 for demo)
    const recommendedProducts = products.slice(0, 8);

    return (
        <div className="min-h-screen bg-bg-page dark:bg-bg-dark text-text-primary dark:text-text-onDark overflow-x-hidden">
            
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column */}
                    <div className="flex flex-col items-start z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-band dark:bg-bg-dark mb-6 border border-border dark:border-border"
                        >
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Sale is Live — up to 50% off</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-bold font-sans tracking-tight leading-[1.1] mb-6 text-text-primary dark:text-text-onDark"
                        >
                            Discover Your <br/>
                            <span className="text-primary">Favorite</span> <br/>
                            Handloom.
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-text-secondary max-w-md mb-8 leading-relaxed"
                        >
                            Authentic Odisha weaves and crafts, brought directly from master artisans to your doorstep.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <button 
                                onClick={() => navigate('/products')}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary-dark text-text-onDark font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                Shop Now <ArrowRight size={20} />
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column (Images) */}
                    <div className="relative h-[500px] w-full hidden sm:block">
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute right-0 top-0 w-3/4 h-4/5 rounded-2xl overflow-hidden shadow-2xl z-10 border border-white/20 dark:border-transparent dark:shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                        >
                            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80" alt="Sambalpuri Saree" className="w-full h-full object-cover" />
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className="absolute left-0 bottom-0 w-2/3 h-2/3 rounded-2xl overflow-hidden shadow-2xl z-20 border border-white/20 dark:border-transparent dark:shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                        >
                            <img src="https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80" alt="Artisan at work" className="w-full h-full object-cover" />
                        </motion.div>
                        
                        {/* Floating Badge */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, type: "spring" }}
                            className="absolute bottom-12 right-12 z-30 bg-bg-dark text-text-onDark px-4 py-3 rounded-2xl shadow-xl flex flex-col items-center rotate-[-5deg]"
                        >
                            <span className="text-2xl font-black text-accent-light">25% OFF</span>
                            <span className="text-xs font-medium text-text-secondary">Summer Restocks</span>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CATEGORY PILLS ROW */}
            <section className="bg-bg-band dark:bg-bg-dark py-6 border-y border-border dark:border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto gap-4 pb-4 sm:pb-0 hide-scrollbar items-center">
                        {CATEGORIES.map((cat, idx) => (
                            <button key={idx} onClick={() => navigate(`/products?category=${cat.label}`)} className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-bg-surface dark:bg-bg-dark text-text-primary dark:text-text-onDark font-semibold shadow-sm hover:bg-bg-band dark:hover:bg-primary-hover/30 hover:text-primary transition-colors border border-border dark:border-border">
                                <cat.icon size={18} className="text-text-secondary" />
                                {cat.label}
                            </button>
                        ))}
                        <button onClick={() => navigate('/products')} className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-text-onDark font-semibold shadow-md hover:bg-primary-dark transition-colors">
                            All Categories
                        </button>
                    </div>
                </div>
            </section>

            {/* RECOMMENDED FOR YOU */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading 
                    title="Recommended for You" 
                    subtitle="Tailored based on your recent activity" 
                    accentWord="Recommended"
                />
                
                {loading ? (
                    <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* TRUST STRIP */}
            <section className="py-16 bg-bg-surface dark:bg-bg-dark border-y border-border dark:border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {TRUST_FEATURES.map((feature, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-accent-tealBg-bg dark:bg-accent-tealBg-900/30 flex items-center justify-center text-accent mb-4">
                                    <feature.icon size={28} />
                                </div>
                                <h4 className="text-lg font-bold text-text-primary dark:text-text-onDark mb-1">{feature.title}</h4>
                                <p className="text-sm text-text-secondary">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SHOP BY STORE */}
            <section className="py-20 bg-bg-band dark:bg-bg-dark max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading title="Shop by Store" subtitle="Discover curated collections from our top artisans." accentWord="Store" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {STORES.map((store, idx) => (
                        <div key={idx} className="bg-bg-surface dark:bg-bg-dark rounded-2xl p-6 shadow-sm border border-border dark:border-border">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="font-bold text-lg text-text-primary dark:text-text-onDark">{store.name}</h4>
                                    <p className="text-xs text-text-secondary">{store.followers} followers</p>
                                </div>
                                <button className="px-4 py-1.5 rounded-full border border-primary text-primary text-xs font-bold hover:bg-primary hover:text-text-onDark transition-colors">
                                    Follow
                                </button>
                            </div>
                            <div className="flex gap-2">
                                {store.images.map((img, i) => (
                                    <div key={i} className="flex-1 aspect-square rounded-xl bg-bg-band dark:bg-bg-dark overflow-hidden">
                                        {/* For demo, just showing colored box if placeholder */}
                                        <div className="w-full h-full bg-gradient-to-br from-secondary-200 to-secondary-300 dark:from-secondary-700 dark:to-secondary-800"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* NEWSLETTER CTA BAND */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto bg-bg-dark rounded-3xl p-10 md:p-16 flex flex-col items-center text-center overflow-hidden relative shadow-2xl">
                    {/* Decorative blobs */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-tealBg/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-text-onDark mb-4">Join the UdraKala Inner Circle</h2>
                        <p className="text-lg text-text-secondary mb-8 max-w-lg mx-auto">Be the first to know about exclusive drops, artisan stories, and special offers.</p>
                        
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full">
                            <input 
                                type="email" 
                                placeholder="Email address" 
                                className="flex-1 px-6 py-4 rounded-full bg-bg-surface/10 border border-white/20 text-text-onDark placeholder-secondary-400 focus:outline-none focus:border-primary focus:bg-bg-surface/20 transition-all"
                            />
                            <button type="submit" className="px-8 py-4 rounded-full bg-primary hover:bg-primary-dark text-text-onDark font-bold transition-all shadow-lg hover:shadow-xl">
                                Subscribe
                            </button>
                        </form>
                        <p className="text-xs text-text-secondary mt-4">By subscribing you agree to our Privacy Policy.</p>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
