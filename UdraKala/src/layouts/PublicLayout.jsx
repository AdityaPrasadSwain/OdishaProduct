import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatWidget from '../components/chat/ChatWidget';
import Footer from '../components/Footer';

const PublicLayout = () => {
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="relative min-h-screen bg-bg-page dark:bg-bg-dark text-text-primary dark:text-text-secondary selection:bg-primary/30 font-sans flex flex-col">
            
            {/* Background Gradient Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-tealBg-500/10 dark:bg-accent-tealBg-500/5 blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <Navbar />
            
            {/* Main Content Area */}
            <main className="flex-1 w-full mx-auto relative z-10 flex flex-col pt-20">
                <div className="animate-fade-in flex-1">
                    <Outlet />
                </div>
            </main>
            
            <ChatWidget />
            <Footer />
        </div>
    );
};

export default PublicLayout;
