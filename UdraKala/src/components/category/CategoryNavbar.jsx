import React from 'react';
import { useData } from '../../context/DataContext';
import CategoryNavItem from './CategoryNavItem';
import { LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryNavbar = () => {
    const { categories, loading } = useData();
    const scrollRef = React.useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (loading) {
        // Simple horizontal skeleton or just blank until loaded
        return (
            <div className="w-full bg-white dark:bg-gray-900 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto no-scrollbar">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-2 min-w-[80px]">
                            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                            <div className="w-12 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const allCategory = {
        id: 'all',
        name: 'All',
        icon: <LayoutGrid size={24} />
    };

    const displayCategories = [allCategory, ...(categories || [])];

    return (
        <div className="w-full bg-white dark:bg-gray-900 py-2 shadow-sm border-b border-gray-100 dark:border-gray-800 mb-2 transition-colors duration-300 relative group">
            <div className="max-w-7xl mx-auto px-10 relative">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    ref={scrollRef}
                    className="flex flex-row items-start gap-6 md:gap-10 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <style>{`
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {displayCategories.map((category) => (
                        <CategoryNavItem key={category.id} category={category} />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default CategoryNavbar;
