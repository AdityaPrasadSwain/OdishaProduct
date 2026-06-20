import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import ProductCard from '../components/shared/ProductCard';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton';

const ProductList = () => {
    const { products, loading } = useData();
    const [searchParams] = useSearchParams();
    
    // Initial states from URL params
    const initialCategory = searchParams.get('category') || 'All';
    const initialSearch = searchParams.get('search') || '';

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [categoryFilter, setCategoryFilter] = useState(initialCategory);
    const [maxPrice, setMaxPrice] = useState(10000); // Default max
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Update filter if URL param changes
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) setCategoryFilter(categoryFromUrl);
        
        const searchFromUrl = searchParams.get('search');
        if (searchFromUrl !== null) setSearchTerm(searchFromUrl);
    }, [searchParams]);

    // Calculate max price from products for slider
    const highestPriceInCatalog = products.reduce((max, p) => p.price > max ? p.price : max, 10000);

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryName = product.category?.name || 'Uncategorized';
        const matchesCategory = categoryFilter === 'All' || categoryName === categoryFilter;
        const matchesPrice = product.discountPrice > 0 ? product.discountPrice <= maxPrice : product.price <= maxPrice;
        
        return matchesSearch && matchesCategory && matchesPrice;
    });

    const categories = ['All', ...new Set(products.map(p => p.category?.name || 'Uncategorized'))];

    // Sidebar Content Component
    const FilterSidebarContent = () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary dark:text-text-onDark mb-4">Categories</h3>
                <div className="space-y-3">
                    {categories.map((cat, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${categoryFilter === cat ? 'bg-primary border-primary' : 'border-border dark:border-border group-hover:border-primary'}`}>
                                {categoryFilter === cat && <div className="w-2.5 h-2.5 bg-bg-surface rounded-sm" />}
                            </div>
                            <input 
                                type="radio" 
                                name="category" 
                                value={cat}
                                checked={categoryFilter === cat}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="hidden"
                            />
                            <span className={`text-sm ${categoryFilter === cat ? 'text-primary font-semibold' : 'text-text-secondary group-hover:text-text-primary dark:group-hover:text-text-onDark'}`}>
                                {cat}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary dark:text-text-onDark mb-4">Max Price: ₹{maxPrice}</h3>
                <input 
                    type="range" 
                    min="0" 
                    max={highestPriceInCatalog} 
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-bg-band dark:bg-bg-dark rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-xs text-text-secondary font-medium">
                    <span>₹0</span>
                    <span>₹{highestPriceInCatalog}+</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-page dark:bg-bg-dark pt-8 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Page Header (Mobile) */}
                <div className="lg:hidden flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary dark:text-text-onDark">All Products</h1>
                        <p className="text-sm text-text-secondary mt-1">Showing {filteredProducts.length} products</p>
                    </div>
                    <button 
                        onClick={() => setIsMobileFiltersOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-bg-surface dark:bg-bg-dark border border-border dark:border-border rounded-full text-sm font-semibold shadow-sm"
                    >
                        <SlidersHorizontal size={16} /> Filters
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-32 bg-bg-surface dark:bg-bg-dark border border-border dark:border-border rounded-3xl p-6 shadow-sm">
                            <div className="mb-8 pb-6 border-b border-border dark:border-border">
                                <h1 className="text-2xl font-bold text-text-primary dark:text-text-onDark font-sans">All Products</h1>
                                <p className="text-sm text-text-secondary mt-1">Showing {filteredProducts.length} products</p>
                            </div>
                            <h2 className="text-lg font-bold text-text-primary dark:text-text-onDark mb-6 flex items-center gap-2">
                                <SlidersHorizontal size={18} /> Filters
                            </h2>
                            <FilterSidebarContent />
                        </div>
                    </div>

                    {/* Mobile Filters Drawer */}
                    <AnimatePresence>
                        {isMobileFiltersOpen && (
                            <>
                                <Motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="fixed inset-0 bg-bg-dark/50 z-40 lg:hidden"
                                />
                                <Motion.div 
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '-100%' }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-bg-surface dark:bg-bg-dark shadow-2xl z-50 p-6 overflow-y-auto lg:hidden"
                                >
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <SlidersHorizontal size={20} /> Filters
                                        </h2>
                                        <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-bg-band dark:bg-bg-dark rounded-full">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <FilterSidebarContent />
                                </Motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Main Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-bg-surface dark:bg-bg-dark rounded-3xl p-12 text-center border border-border dark:border-border shadow-sm mt-8 lg:mt-0">
                                <h3 className="text-xl font-bold text-text-primary dark:text-text-onDark mb-2">No products found</h3>
                                <p className="text-text-secondary">Try adjusting your filters or search criteria.</p>
                                <button 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setCategoryFilter('All');
                                        setMaxPrice(highestPriceInCatalog);
                                    }}
                                    className="mt-6 px-6 py-2.5 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary/20 transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default ProductList;
