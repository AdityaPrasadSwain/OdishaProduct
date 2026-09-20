import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-bg-page overflow-hidden">
            {/* Admin Sidebar goes here */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Admin Top Header goes here */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-page p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
