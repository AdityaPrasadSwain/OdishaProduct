import React from 'react';
import { useData } from '../../context/DataContext';
import CategoryNavItem from './CategoryNavItem';
import { LayoutGrid } from 'lucide-react';

const CategoryNavbar = () => {
    const { categories, loading } = useData();

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
        <div className="w-full bg-white dark:bg-gray-900 py-2 shadow-sm border-b border-gray-100 dark:border-gray-800 mb-2 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-row items-start gap-6 md:gap-10 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                    {displayCategories.map((category) => (
                        <CategoryNavItem key={category.id} category={category} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryNavbar;
