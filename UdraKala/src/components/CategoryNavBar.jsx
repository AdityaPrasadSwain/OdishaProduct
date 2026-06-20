import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

const CategoryNavBar = ({ categories }) => {
    const location = useLocation();
    const scrollContainerRef = useRef(null);
    const [activeTabRect, setActiveTabRect] = useState(null);
    const activeItemRef = useRef(null);

    // Identify active category based on current pathname
    const activeCategoryId = categories.find(c => location.pathname.includes(c.href) && c.href !== '/')?.id 
                           || (location.pathname === '/' ? categories.find(c => c.href === '/')?.id : null)
                           || categories[0]?.id; // Fallback to first

    useEffect(() => {
        // Measure the active tab for the sliding indicator
        if (activeItemRef.current) {
            const container = scrollContainerRef.current;
            const item = activeItemRef.current;
            
            // Calculate relative to the scrolling container
            setActiveTabRect({
                left: item.offsetLeft,
                width: item.offsetWidth,
            });

            // Scroll into view if needed (mostly for mobile)
            const scrollLeft = item.offsetLeft - (container.offsetWidth / 2) + (item.offsetWidth / 2);
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }, [activeCategoryId, categories, location.pathname]);

    return (
        <div className="w-full bg-bg-surface dark:bg-bg-dark border-b border-border dark:border-border relative">
            <div className="max-w-[1400px] mx-auto px-2 relative">
                {/* Horizontal Scroll Container */}
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scrollbar-hide py-3 md:py-4 gap-4 md:gap-8 justify-start lg:justify-center relative scroll-smooth"
                    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                >
                    {categories.map((category) => {
                        const isActive = activeCategoryId === category.id;
                        const Icon = category.icon;

                        return (
                            <Link
                                key={category.id}
                                to={category.href}
                                ref={isActive ? activeItemRef : null}
                                title={category.label} // Tooltip for full name
                                className={`flex flex-col items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 shrink-0 transition-colors duration-200 group ${
                                    isActive 
                                        ? 'text-primary dark:text-primary' 
                                        : 'text-text-secondary dark:text-text-secondary hover:text-text-primary dark:hover:text-text-onDark'
                                }`}
                            >
                                <div className={`transition-transform duration-200 group-hover:-translate-y-0.5 ${isActive ? 'scale-110' : ''}`}>
                                    {Icon && <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />}
                                </div>
                                <span className={`text-[11px] md:text-xs tracking-wide max-w-[70px] md:max-w-[80px] truncate text-center ${isActive ? 'font-bold' : 'font-medium'}`}>
                                    {category.label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Sliding Indicator Bar */}
                    {activeTabRect && (
                        <motion.div
                            initial={false}
                            animate={{
                                x: activeTabRect.left,
                                width: activeTabRect.width
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="absolute bottom-0 h-[3px] bg-primary rounded-t-full"
                        />
                    )}
                </div>
            </div>
            
            {/* Custom CSS to hide scrollbar in Webkit browsers if utility class fails */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default CategoryNavBar;
