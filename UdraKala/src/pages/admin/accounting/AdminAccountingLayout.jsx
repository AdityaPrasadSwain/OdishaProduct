import React, { useState } from 'react';
import SellerPayoutManager from './SellerPayoutManager';
import AgentPayoutManager from './AgentPayoutManager';
import RefundManager from './RefundManager';
import { BadgeIndianRupee, Truck, RotateCcw } from 'lucide-react';

const AdminAccountingLayout = () => {
    const [activeTab, setActiveTab] = useState('sellers');

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Financial Accounting</h1>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b dark:border-gray-700 pb-1">
                <button
                    onClick={() => setActiveTab('sellers')}
                    className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-colors font-medium text-sm
                        ${activeTab === 'sellers'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <BadgeIndianRupee size={18} />
                    Seller Payouts
                </button>
                <button
                    onClick={() => setActiveTab('agents')}
                    className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-colors font-medium text-sm
                        ${activeTab === 'agents'
                            ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <Truck size={18} />
                    Agent Payouts
                </button>
                <button
                    onClick={() => setActiveTab('refunds')}
                    className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-colors font-medium text-sm
                        ${activeTab === 'refunds'
                            ? 'border-red-600 text-red-600 dark:text-red-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <RotateCcw size={18} />
                    Refunds
                </button>
            </div>

            {/* Content Area */}
            <div className="mt-4">
                {activeTab === 'sellers' && <SellerPayoutManager />}
                {activeTab === 'agents' && <AgentPayoutManager />}
                {activeTab === 'refunds' && <RefundManager />}
            </div>
        </div>
    );
};

export default AdminAccountingLayout;
