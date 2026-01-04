import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatWidget from '../components/chat/ChatWidget';
import Footer from '../components/Footer';

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-secondary-50 dark:bg-dark text-secondary-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            <ChatWidget />
            <Footer />
        </div>
    );
};

export default PublicLayout;
