import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'motion/react';

const CategoryNavItem = ({ category }) => {
    return (
        <Motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center justify-center gap-2 cursor-pointer min-w-[80px] md:min-w-[100px]"
        >
            <Link to={`/products?category=${category.name}`} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-900 p-1">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                        {category.imageUrl ? (
                            <img
                                src={category.imageUrl}
                                alt={category.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = '/default_category_placeholder.png'; }}
                            />
                        ) : (
                            <img
                                src="/default_category_placeholder.png"
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 text-center leading-tight hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    {category.name}
                </span>
            </Link>
        </Motion.div>
    );
};

export default CategoryNavItem;
