import React from 'react';
import { XMarkIcon, CheckBadgeIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const PayoutDetailsModal = ({ isOpen, onClose, seller, onInitiatePayout }) => {
    if (!isOpen || !seller) return null;

    // Mock data for order breakdown - effectively this would come from an API call based on seller.id
    // For now, we use the seller object assuming it has a 'pendingEarnings' array or similar populated
    const earnings = seller.pendingEarnings || [];

    const totalGross = earnings.reduce((acc, curr) => acc + (curr.grossAmount || 0), 0);
    const totalCommission = earnings.reduce((acc, curr) => acc + (curr.commission || 0), 0);
    const totalGst = earnings.reduce((acc, curr) => acc + (curr.gstAmount || 0), 0);
    const totalNet = earnings.reduce((acc, curr) => acc + (curr.netAmount || 0), 0);

    const canPayout = seller.isBankVerified && earnings.length > 0;

    return (
        <div className="fixed inset-0 z-40 overflow-y-auto w-full">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

                <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
                    {/* Header */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                Payout Details
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Review seller details and earnings breakdown.</p>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Seller Info */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Seller Information</h4>
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-lg font-medium text-gray-900">{seller.name}</span>
                                    <span className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{seller.shopName || 'Shop Name'}</span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>ID: <span className="font-mono text-xs">{seller.id}</span></p>
                                    <p>{seller.email}</p>
                                    <p>{seller.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bank Info */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Bank Details</h4>
                            <div className={`bg-white p-4 rounded-lg border shadow-sm ${seller.isBankVerified ? 'border-green-200' : 'border-red-200'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-900">{seller.bankName}</p>
                                        <p className="text-sm text-gray-600">Acc: <span className="font-mono">XXXXXX{seller.bankAccountNumber ? seller.bankAccountNumber.slice(-4) : 'XXXX'}</span></p>
                                        <p className="text-sm text-gray-600">IFSC: <span className="font-mono">{seller.ifscCode}</span></p>
                                        <p className="text-sm text-gray-600">Holder: {seller.accountHolderName}</p>
                                    </div>
                                    <div>
                                        {seller.isBankVerified ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckBadgeIcon className="h-4 w-4 mr-1" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                                                Unverified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Breakdown */}
                    <div className="px-6 py-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Pending Earnings Breakdown</h4>
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Gross</th>
                                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Comm (5%)</th>
                                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">GST (18%)</th>
                                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Net Payable</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {earnings.length > 0 ? (
                                        earnings.map((earning) => (
                                            <tr key={earning.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    #{earning.orderId ? earning.orderId.substring(0, 8) : 'ORD-XXXX'}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">₹{earning.grossAmount?.toFixed(2)}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-red-500">-₹{earning.commission?.toFixed(2)}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-red-500">-₹{earning.gstAmount?.toFixed(2)}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-green-600">₹{earning.netAmount?.toFixed(2)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-3 py-8 text-center text-sm text-gray-500">
                                                No pending earnings found for this seller.
                                            </td>
                                        </tr>
                                    )}

                                    {/* Footer Row */}
                                    {earnings.length > 0 && (
                                        <tr className="bg-gray-50 font-semibold">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">TOTAL</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">₹{totalGross.toFixed(2)}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-red-600">-₹{totalCommission.toFixed(2)}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-red-600">-₹{totalGst.toFixed(2)}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-green-700 text-lg">₹{totalNet.toFixed(2)}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
                        <button
                            type="button"
                            className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${canPayout
                                    ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
                                    : 'bg-gray-300 cursor-not-allowed'
                                }`}
                            disabled={!canPayout}
                            onClick={() => onInitiatePayout({
                                sellerName: seller.name,
                                bankAccountMasked: seller.bankAccountNumber ? 'XXXX' + seller.bankAccountNumber.slice(-4) : 'XXXX',
                                netAmount: totalNet,
                                commission: totalCommission,
                                gst: totalGst
                            })}
                        >
                            Initiate Payout
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayoutDetailsModal;
