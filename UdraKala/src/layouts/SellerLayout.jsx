import React from 'react';
import { Outlet } from 'react-router-dom';

const SellerLayout = () => {
    return (
        <div className="flex h-screen bg-bg-page overflow-hidden">
            {/* Seller Sidebar goes here */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Seller Top Header goes here */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-page p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;
