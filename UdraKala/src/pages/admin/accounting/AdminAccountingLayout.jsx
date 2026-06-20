import React, { useState } from 'react';
import SellerPayoutManager from './SellerPayoutManager';

import RefundManager from './RefundManager';
import { BadgeIndianRupee, Truck, RotateCcw } from 'lucide-react';

const AdminAccountingLayout = () => {
    const [activeTab, setActiveTab] = useState('sellers');

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-text-primary dark:text-text-onDark">Financial Accounting</h1>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b dark:border-border pb-1">
                <button
                    onClick={() => setActiveTab('sellers')}
                    className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-colors font-medium text-sm
                        ${activeTab === 'sellers'
                            ? 'border-primary text-primary dark:text-primary'
                            : 'border-transparent text-text-secondary hover:text-text-secondary dark:hover:text-text-secondary'}`}
                >
                    <BadgeIndianRupee size={18} />
                    Seller Payouts
                </button>
                <button
                    onClick={() => setActiveTab('refunds')}
                    className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-colors font-medium text-sm
                        ${activeTab === 'refunds'
                            ? 'border-red-600 text-status-error dark:text-red-400'
                            : 'border-transparent text-text-secondary hover:text-text-secondary dark:hover:text-text-secondary'}`}
                >
                    <RotateCcw size={18} />
                    Refunds
                </button>
            </div>

            {/* Content Area */}
            <div className="mt-4">
                {activeTab === 'sellers' && <SellerPayoutManager />}
                {activeTab === 'refunds' && <RefundManager />}
            </div>
        </div>
    );
};

export default AdminAccountingLayout;
