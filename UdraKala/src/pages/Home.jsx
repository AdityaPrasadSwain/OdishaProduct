import React, { Suspense } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Hero3D from '../components/hero/Hero3D';
import FeatureGrid from '../components/FeatureGrid';
import ScrollReveal from '../components/ui/ScrollReveal';
import Button from '../components/ui/Button';
import CategoryNavbar from '../components/category/CategoryNavbar';

const Home = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-200 overflow-x-hidden">
            {/* Category Navigation Bar (Flipkart Style) */}
            <CategoryNavbar />

            {/* Section 1: Hero with 3D Background */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                <Suspense fallback={<div className="absolute inset-0 bg-blue-50 dark:bg-gray-900" />}>
                    <Hero3D />
                </Suspense>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-bold font-serif mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300"
                    >
                        {t('weave_legacy')} <br /> <span className="text-primary">UdraKala</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
                    >
                        {t('discover_elegance')}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex gap-4 justify-center"
                    >
                        <Link to="/products">
                            <Button size="lg" className="rounded-full px-8">{t('shop_collection')}</Button>
                        </Link>
                        <Button variant="outline" size="lg" className="rounded-full px-8 backdrop-blur-sm bg-white/10 border-gray-400 dark:border-gray-600">{t('our_story')}</Button>
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Cultural Storytelling */}
            <section className="py-24 px-4 bg-secondary-50 dark:bg-dark">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <ScrollReveal variant="fadeInLeft" className="flex-1 w-full relative group">
                        <div className="absolute -inset-4 bg-primary-100 dark:bg-primary-900/20 rounded-xl rotate-2 group-hover:rotate-1 transition-transform duration-500 blur-xl opacity-70"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px]">
                            {/* Placeholder for Artisan Image - using a gradient for now as placeholder */}
                            <div className="h-full w-full bg-gradient-to-br from-primary-100 to-orange-50 dark:from-secondary-800 dark:to-secondary-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                <span className="text-secondary-400 font-serif italic text-2xl">{t('master_weaver')}</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <p className="text-white font-medium">Bargarh, Odisha</p>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeInRight" className="flex-1 space-y-8">
                        <div>
                            <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Our Heritage</span>
                            <h2 className="text-4xl md:text-5xl font-bold font-serif text-secondary-900 dark:text-white leading-tight">
                                {t('handcrafted_by_master_weavers')}
                            </h2>
                        </div>
                        <p className="text-xl text-secondary-600 dark:text-gray-300 leading-relaxed">
                            {t('every_thread_story')}
                        </p>

                        <div className="grid grid-cols-2 gap-8 pt-4">
                            <div className="p-4 rounded-xl bg-white dark:bg-secondary-800 shadow-sm border border-secondary-100 dark:border-secondary-700">
                                <h4 className="text-3xl font-bold text-primary-600 mb-1">500+</h4>
                                <p className="text-sm text-secondary-500 underline decoration-primary-300 decoration-2 underline-offset-4">{t('artisans_empowered')}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white dark:bg-secondary-800 shadow-sm border border-secondary-100 dark:border-secondary-700">
                                <h4 className="text-3xl font-bold text-primary-600 mb-1">100%</h4>
                                <p className="text-sm text-secondary-500 underline decoration-primary-300 decoration-2 underline-offset-4">{t('authentic_handloom')}</p>
                            </div>
                        </div>

                        <Button variant="outline" size="lg" className="mt-4 border-secondary-900 text-secondary-900 hover:bg-secondary-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-secondary-900">
                            {t('read_stories')}
                        </Button>
                    </ScrollReveal>
                </div>
            </section>

            {/* Section 3: Products Grid */}
            <section className="py-24 px-4 bg-white dark:bg-secondary-900">
                <div className="max-w-7xl mx-auto">
                    <ScrollReveal variant="fadeInUp">
                        <div className="text-center mb-20">
                            <span className="text-primary-600 font-bold tracking-widest uppercase text-xs mb-3 block">{t('new_arrivals')}</span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-secondary-900 dark:text-white">{t('curated_masterpieces')}</h2>
                            <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full mb-6"></div>
                            <p className="text-secondary-500 text-lg max-w-2xl mx-auto">{t('explore_exclusive')}</p>
                        </div>
                    </ScrollReveal>

                    <FeatureGrid />
                </div>
            </section>

            {/* Minimalist Trust Section */}
            <div className="py-20 border-t border-secondary-100 bg-secondary-50 dark:border-secondary-800 dark:bg-dark transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {[
                        { val: '500+', label: 'Artisans Empowered' },
                        { val: '12k+', label: 'Happy Customers' },
                        { val: '100%', label: 'Authentic Handloom' },
                        { val: '24/7', label: 'Premium Support' }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-secondary-800 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-secondary-100 dark:border-secondary-700"
                        >
                            <h3 className="text-4xl font-bold text-primary-600 mb-2">{item.val}</h3>
                            <p className="text-sm font-medium text-secondary-500 uppercase tracking-wider">{item.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};



export default Home;
