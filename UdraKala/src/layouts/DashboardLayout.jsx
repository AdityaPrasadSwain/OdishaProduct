import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatWidget from '../components/chat/ChatWidget';
import Header from '../components/Navbar';
import Footer from '../components/Footer';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Header / Navbar */}
            <Header />

            {/* Main Content Wrapper */}
            <main className="p-4 md:p-6 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </div>
            </main>
            <ChatWidget />
            <Footer />
        </div>
    );
};

export default DashboardLayout;
