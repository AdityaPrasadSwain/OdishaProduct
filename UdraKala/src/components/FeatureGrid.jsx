import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureGrid = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 py-24 relative overflow-hidden transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-orange-500 font-medium tracking-wide uppercase mb-3">Curated Collections</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Handpicked for Connoisseurs</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Explore our exclusive range of heritage products, meticulously categorized for your refined taste.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
                    {/* Large Item - Sarees */}
                    <div className="col-span-1 md:col-span-2 row-span-2 relative group overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-900/50">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                            alt="Sambalpuri Saree"
                        />
                        <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="text-2xl font-bold text-white mb-2">Sambalpuri Silk</h4>
                                    <p className="text-gray-300">The pride of Odisha. Ikat handlooms.</p>
                                </div>
                                <Link to="/products?category=Sarees" className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition">
                                    <ArrowUpRight size={24} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Medium Item - Pattachitra */}
                    <div className="col-span-1 md:col-span-2 row-span-1 relative group overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-900/50">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                            alt="Art"
                        />
                        <div className="absolute bottom-0 left-0 p-8 z-20">
                            <h4 className="text-xl font-bold text-white mb-1">Pattachitra Art</h4>
                            <p className="text-gray-300 text-sm">Mythology painted on canvas.</p>
                        </div>
                    </div>

                    {/* Small Item 1 */}
                    <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-900/50">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1626177196020-f57f58d08c5c?w=800&q=80"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                            alt="Decor"
                        />
                        <div className="absolute bottom-6 left-6 z-20">
                            <h4 className="text-lg font-bold text-white">Home Decor</h4>
                        </div>
                    </div>

                    {/* Small Item 2 */}
                    <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-900/50">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1615655114865-4cc1bda5901e?w=800&q=80"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                            alt="Jewelry"
                        />
                        <div className="absolute bottom-6 left-6 z-20">
                            <h4 className="text-lg font-bold text-white">Tribal Jewelry</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureGrid;
