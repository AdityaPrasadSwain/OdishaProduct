import React, { Suspense } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Hero3D from '../components/hero/Hero3D';
import FeatureGrid from '../components/FeatureGrid';
import ScrollReveal from '../components/ui/ScrollReveal';
import Button from '../components/ui/Button';
import CategoryNavbar from '../components/category/CategoryNavbar';

const Home = () => {
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
                        Weave the Legacy of <br /> <span className="text-primary">UdraKala</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
                    >
                        Discover the timeless elegance of Odisha's handloom. Where tradition meets modern craftsmanship.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex gap-4 justify-center"
                    >
                        <Link to="/products">
                            <Button size="lg" className="rounded-full px-8">Shop Collection</Button>
                        </Link>
                        <Button variant="outline" size="lg" className="rounded-full px-8 backdrop-blur-sm bg-white/10 border-gray-400 dark:border-gray-600">Our Story</Button>
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Cultural Storytelling */}
            <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <ScrollReveal variant="fadeInLeft" className="flex-1">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                            {/* Placeholder for Artisan Image - using a gradient for now as placeholder */}
                            <div className="h-[400px] w-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                                <span className="text-muted font-serif italic text-xl">Artisan at work</span>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeInRight" className="flex-1 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-dark dark:text-white">
                            Handcrafted by Master Weavers
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            Every thread tells a story. Our Sambalpuri and Ikat sarees are not just garments; they are canvases of culture, woven with precision and passion by third-generation artisans from Western Odisha.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <div className="text-center">
                                <h4 className="text-2xl font-bold text-primary">500+</h4>
                                <p className="text-sm text-muted">Artisans</p>
                            </div>
                            <div className="w-px bg-gray-300 dark:bg-gray-700"></div>
                            <div className="text-center">
                                <h4 className="text-2xl font-bold text-primary">100%</h4>
                                <p className="text-sm text-muted">Authentic</p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>



            {/* Section 3: Products Grid */}
            <section className="py-20 px-4">
                <ScrollReveal variant="fadeInUp">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Curated Masterpieces</h2>
                        <p className="text-muted max-w-2xl mx-auto">Explore our exclusive collection of handwoven sarees, dupattas, and fabrics.</p>
                    </div>
                </ScrollReveal>

                <FeatureGrid />
            </section>

            {/* Minimalist Trust Section */}
            <div className="py-16 border-t border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-gray-900 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center opacity-70">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">500+</h3>
                        <p className="text-sm">Artisans Empowered</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">12k+</h3>
                        <p className="text-sm">Happy Customers</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">100%</h3>
                        <p className="text-sm">Authentic Handloom</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">24/7</h3>
                        <p className="text-sm">Support</p>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default Home;
