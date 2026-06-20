import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatWidget from '../components/chat/ChatWidget';
import Header from '../components/Navbar';
import Footer from '../components/Footer';

const DashboardLayout = () => {
    const location = useLocation();
    const isDashboardView = location.pathname.includes('/seller/dashboard') || location.pathname.includes('/admin/dashboard');

    return (
        <div className="min-h-screen w-full bg-bg-page dark:bg-bg-dark transition-colors duration-300">
            {/* Header / Navbar */}
            {!isDashboardView && <Header />}

            {/* Main Content Wrapper */}
            <main className={`${isDashboardView ? 'h-screen w-screen overflow-hidden' : 'p-4 md:p-6 pb-20 pt-24 md:pt-[72px]'}`}>
                <div className={`${isDashboardView ? 'w-full h-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8'}`}>
                    <Outlet />
                </div>
            </main>
            <ChatWidget />
            <Footer />
        </div>
    );
};

export default DashboardLayout;
