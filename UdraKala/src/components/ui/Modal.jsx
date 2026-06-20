import React from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/50 backdrop-blur-sm">
            <div className="bg-bg-surface dark:bg-bg-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border dark:border-border animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-border dark:border-border sticky top-0 bg-bg-surface dark:bg-bg-dark z-10">
                    <h3 className="text-lg font-bold text-dark dark:text-text-onDark">{title}</h3>
                    <button onClick={onClose} className="text-muted hover:text-dark dark:hover:text-text-onDark transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
