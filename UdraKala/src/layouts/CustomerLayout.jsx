import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CustomerLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-bg-page">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Customer Account Sidebar (optional/collapsible) */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        {/* Sidebar content */}
                    </div>
                    {/* Main Content */}
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CustomerLayout;
