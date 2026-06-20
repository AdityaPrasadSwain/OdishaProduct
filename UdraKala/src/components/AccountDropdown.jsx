import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const AccountDropdown = ({ user, menuItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const dropdownRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    // Detect touch devices to disable hover behavior and enable click-only
    useEffect(() => {
        const checkTouch = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkTouch();
        window.addEventListener('resize', checkTouch);
        return () => window.removeEventListener('resize', checkTouch);
    }, []);

    const openDropdown = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setIsOpen(true);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    const handleMouseEnter = () => {
        if (!isTouchDevice) {
            openDropdown();
        }
    };

    const handleMouseLeave = () => {
        if (!isTouchDevice) {
            closeTimeoutRef.current = setTimeout(() => {
                closeDropdown();
            }, 150); // 150ms delay to prevent flickering
        }
    };

    const handleTriggerClick = () => {
        if (isTouchDevice) {
            setIsOpen(!isOpen);
        } else {
            // Optional: If they click on desktop, it acts as a toggle too, 
            // but hover is already active.
            setIsOpen(!isOpen);
        }
    };

    // Click outside listener
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Escape key listener for accessibility
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeDropdown();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <div 
            className="relative ml-2 z-50" 
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                onClick={handleTriggerClick}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                className="flex items-center justify-center gap-2 px-2 py-1 rounded-full border border-transparent hover:border-border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    {user?.profileImage ? (
                        <img src={user.profileImage} alt={user?.fullName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center text-text-onDark font-bold text-sm">
                            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    )}
                </div>
                <span className="hidden lg:block text-sm font-semibold text-text-primary dark:text-text-onDark uppercase max-w-[120px] truncate">
                    {user?.fullName || 'USER'}
                </span>
                <ChevronDown size={16} className={`hidden lg:block text-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-bg-surface dark:bg-bg-dark rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden"
                        role="menu"
                    >
                        <div className="py-2 flex flex-col">
                            {menuItems.map((group, groupIdx) => (
                                <div key={groupIdx}>
                                    {group.title && (
                                        <div className={`px-5 ${groupIdx === 0 ? 'pt-2 pb-2' : 'pt-3 pb-2'} text-[13px] font-bold text-text-primary dark:text-text-onDark uppercase tracking-wide`}>
                                            {group.title}
                                        </div>
                                    )}
                                    
                                    {group.items.map((item, itemIdx) => {
                                        const Icon = item.icon;
                                        const isDanger = item.isDanger;
                                        const baseClasses = `flex items-center px-5 py-3 w-full text-sm transition-colors focus-visible:bg-bg-page dark:focus-visible:bg-bg-dark focus-visible:outline-none focus-visible:text-primary cursor-pointer ${
                                            isDanger 
                                                ? 'text-status-error hover:bg-red-50 dark:hover:bg-red-900/10' 
                                                : 'text-text-primary dark:text-text-onDark hover:bg-bg-page dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary'
                                        }`;

                                        const content = (
                                            <>
                                                {Icon && <Icon size={18} className="mr-4 shrink-0" strokeWidth={1.5} />}
                                                <span className="font-medium">{item.label}</span>
                                            </>
                                        );

                                        if (item.to) {
                                            return (
                                                <Link
                                                    key={itemIdx}
                                                    to={item.to}
                                                    onClick={closeDropdown}
                                                    role="menuitem"
                                                    className={baseClasses}
                                                >
                                                    {content}
                                                </Link>
                                            );
                                        }

                                        return (
                                            <button
                                                key={itemIdx}
                                                onClick={() => {
                                                    if (item.onClick) item.onClick();
                                                    closeDropdown();
                                                }}
                                                role="menuitem"
                                                className={baseClasses}
                                            >
                                                {content}
                                            </button>
                                        );
                                    })}
                                    
                                    {/* Separator if not the last group */}
                                    {groupIdx < menuItems.length - 1 && (
                                        <div className="h-px bg-border dark:bg-white/5 my-2 mx-5"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AccountDropdown;
