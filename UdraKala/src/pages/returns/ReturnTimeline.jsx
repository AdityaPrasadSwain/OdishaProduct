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
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-bg-band dark:bg-bg-dark -z-0"></div>
                <div
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-status-success transition-all duration-500 -z-0 ${isRejected ? 'bg-status-error' : ''}`}
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
                                        ? 'text-status-error border-red-500 text-status-error'
                                        : isCompleted
                                            ? 'bg-status-success border-green-500 text-text-onDark'
                                            : 'bg-bg-surface dark:bg-bg-dark border-border dark:border-border text-text-secondary dark:text-text-secondary'
                                    }
                                `}
                            >
                                <IconComponent size={18} strokeWidth={isCompleted ? 3 : 2} />
                            </div>
                            <div className="absolute top-10 md:top-12 w-24 text-center">
                                <p
                                    className={`text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-colors
                                        ${isStepRejected
                                            ? 'text-status-error'
                                            : isCompleted
                                                ? 'text-text-primary dark:text-text-onDark'
                                                : 'text-text-secondary dark:text-text-secondary'
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
