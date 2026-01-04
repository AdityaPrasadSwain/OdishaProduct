import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'motion/react';

const CategoryCard = ({ category }) => {
    return (
        <Motion.div
            whileHover={{ y: -5 }}
            className="flex flex-col items-center gap-3 cursor-pointer group"
        >
            <Link to={`/products?category=${category.name}`} className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-md border-4 border-white dark:border-gray-800 group-hover:shadow-xl group-hover:border-orange-100 dark:group-hover:border-orange-900/30 transition-all duration-300">
                    <img
                        src={category.imageUrl || '/default_category_placeholder.png'}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/default_category_placeholder.png'; }}
                    />
                </div>
            </Link>
            <Link
                to={`/products?category=${category.name}`}
                className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors"
            >
                {category.name}
            </Link>
        </Motion.div>
    );
};

export default CategoryCard;
