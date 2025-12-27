import React from 'react';
import { useData } from '../../context/DataContext';
import CategoryCard from './CategoryCard';
import CategorySkeleton from '../skeletons/CategorySkeleton';

const CategoryList = () => {
    const { categories, loading } = useData();

    if (loading) {
        return <CategorySkeleton />;
    }

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 py-4">
            {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
            ))}
        </div>
    );
};

export default CategoryList;
