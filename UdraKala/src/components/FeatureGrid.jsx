import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureGrid = () => {
    return (
        <div className="bg-white dark:bg-dark py-12 relative overflow-hidden transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
                    {/* Large Item - Sarees */}
                    <div className="col-span-1 md:col-span-2 row-span-2 relative group overflow-hidden rounded-3xl border border-secondary-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt="Sambalpuri Saree"
                        />
                        <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-wider text-white uppercase bg-primary-600 rounded-full">Best Seller</span>
                                    <h4 className="text-3xl font-bold text-white mb-2 font-serif">Sambalpuri Silk</h4>
                                    <p className="text-gray-300 font-light">The pride of Odisha. Ikat handlooms.</p>
                                </div>
                                <Link to="/products?category=Sarees" className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary-600 hover:border-primary-600 border border-white/30 transition-all duration-300">
                                    <ArrowUpRight size={24} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Medium Item - Pattachitra */}
                    <div className="col-span-1 md:col-span-2 row-span-1 relative group overflow-hidden rounded-3xl border border-secondary-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt="Art"
                        />
                        <div className="absolute bottom-0 left-0 p-8 z-20">
                            <h4 className="text-2xl font-bold text-white mb-1 font-serif">Pattachitra Art</h4>
                            <p className="text-gray-300 text-sm font-light">Mythology painted on canvas.</p>
                        </div>
                    </div>

                    {/* Small Item 1 */}
                    <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-3xl border border-secondary-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1626177196020-f57f58d08c5c?w=800&q=80"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt="Decor"
                        />
                        <div className="absolute bottom-6 left-6 z-20">
                            <h4 className="text-xl font-bold text-white font-serif">Home Decor</h4>
                        </div>
                    </div>

                    {/* Small Item 2 */}
                    <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-3xl border border-secondary-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1615655114865-4cc1bda5901e?w=800&q=80"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt="Jewelry"
                        />
                        <div className="absolute bottom-6 left-6 z-20">
                            <h4 className="text-xl font-bold text-white font-serif">Tribal Jewelry</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureGrid;
