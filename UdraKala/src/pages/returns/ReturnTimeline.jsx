import React from 'react';
import { Check, Clock, Truck, Package, RefreshCw, XCircle, DollarSign, PackageCheck } from 'lucide-react';

const ReturnTimeline = ({ status, type }) => {
    // Backend Enums: PENDING, APPROVED, REJECTED, PICKUP_SCHEDULED, REFUND_INITIATED, COMPLETED

    const steps = [
        { key: 'PENDING', label: 'Requested', icon: Clock },
        { key: 'APPROVED', label: 'Approved', icon: Check },
        { key: 'PICKUP_SCHEDULED', label: 'Pickup', icon: Truck },
        { key: 'REFUND_INITIATED', label: type === 'REPLACE' ? 'Replacement' : 'Refund', icon: type === 'REPLACE' ? RefreshCw : DollarSign },
        { key: 'COMPLETED', label: 'Completed', icon: type === 'REPLACE' ? PackageCheck : Check },
    ];

    // Determine current step index
    let activeIndex = 0;
    let isRejected = false;

    if (status === 'REJECTED') {
        isRejected = true;
        activeIndex = 1; // Show rejection at approval stage
    } else {
        switch (status) {
            case 'PENDING': activeIndex = 0; break;
            case 'APPROVED': activeIndex = 1; break;
            case 'PICKUP_SCHEDULED': activeIndex = 2; break;
            case 'REFUND_INITIATED': activeIndex = 3; break;
            case 'COMPLETED': activeIndex = 4; break;
            default: activeIndex = 0;
        }
    }

    return (
        <div className="w-full py-6 px-4">
            <div className="relative flex items-center justify-between w-full">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-0"></div>
                <div
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 transition-all duration-500 -z-0 ${isRejected ? 'bg-red-500' : ''}`}
                    style={{ width: isRejected ? '25%' : `${(activeIndex / (steps.length - 1)) * 100}%` }}
                ></div>

                {/* Steps */}
                {steps.map((step, index) => {
                    const isCompleted = index <= activeIndex && !isRejected;
                    const isCurrent = index === activeIndex;
                    const isStepRejected = isRejected && index === 1; // Reject at Approved step

                    // Icon Logic
                    let IconComponent = step.icon;
                    if (isStepRejected) IconComponent = XCircle;

                    return (
                        <div key={step.key} className="relative z-10 flex flex-col items-center group">
                            <div
                                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                                    ${isStepRejected
                                        ? 'bg-red-100 border-red-500 text-red-600'
                                        : isCompleted
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                                    }
                                `}
                            >
                                <IconComponent size={18} strokeWidth={isCompleted ? 3 : 2} />
                            </div>
                            <div className="absolute top-10 md:top-12 w-24 text-center">
                                <p
                                    className={`text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-colors
                                        ${isStepRejected
                                            ? 'text-red-600'
                                            : isCompleted
                                                ? 'text-gray-900 dark:text-white'
                                                : 'text-gray-400 dark:text-gray-600'
                                        }
                                    `}
                                >
                                    {isStepRejected ? 'Rejected' : step.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReturnTimeline;
