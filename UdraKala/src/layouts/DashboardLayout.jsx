import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Header / Navbar */}
            <Header />

            {/* Main Content Wrapper */}
            <main className="p-4 md:p-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
