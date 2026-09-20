import { Ticket, Copy, Scissors } from 'lucide-react';
import Card from '../../components/ui/Card';
import { useState } from 'react';
import Swal from 'sweetalert2';

const Coupons = () => {
    // Mock coupons for UI
    const [coupons] = useState([
        { id: 1, code: 'WELCOME50', description: 'Get 50% off on your first purchase!', expiry: '2026-12-31', minSpend: 500 },
        { id: 2, code: 'FESTIVAL20', description: 'Flat 20% off during the festive season.', expiry: '2026-10-15', minSpend: 1500 },
        { id: 3, code: 'FREESHIP', description: 'Free shipping on orders above ₹1000.', expiry: '2026-08-30', minSpend: 1000 },
    ]);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        Swal.fire({
            icon: 'success',
            title: 'Copied!',
            text: `Coupon code ${code} copied to clipboard`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Ticket className="w-8 h-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold text-text-primary dark:text-text-onDark">My Coupons</h1>
                    <p className="text-sm text-text-secondary">Exclusive offers and discounts just for you.</p>
                </div>
            </div>

            {coupons.length === 0 ? (
                <Card className="text-center py-16">
                    <Ticket className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-text-primary dark:text-text-onDark">No Active Coupons</h3>
                    <p className="text-text-secondary mt-2">Check back later for exciting offers!</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {coupons.map((coupon) => (
                        <div key={coupon.id} className="relative group">
                            {/* Decorative dashed border container */}
                            <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-2xl scale-[1.02] -z-10 transition-transform group-hover:scale-105" />
                            
                            <Card className="bg-bg-surface/90 dark:bg-bg-dark/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-glass dark:shadow-glass-dark h-full flex flex-col justify-between overflow-hidden relative">
                                {/* Decorative circle cutouts for ticket effect */}
                                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-bg-page dark:bg-[#121212] rounded-full -translate-y-1/2 border-r border-border dark:border-white/10" />
                                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-bg-page dark:bg-[#121212] rounded-full -translate-y-1/2 border-l border-border dark:border-white/10" />

                                <div className="p-2">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-mono font-bold tracking-wider border border-primary/20 flex items-center gap-2">
                                            <Scissors size={14} className="rotate-90" />
                                            {coupon.code}
                                        </div>
                                        <span className="text-xs font-semibold text-status-warning bg-status-warning/10 px-2 py-1 rounded">
                                            Valid till {new Date(coupon.expiry).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    <p className="text-text-primary dark:text-text-onDark font-medium mb-2">{coupon.description}</p>
                                    <p className="text-xs text-text-secondary">Minimum spend: ₹{coupon.minSpend}</p>
                                </div>
                                
                                <div className="mt-6 pt-4 border-t border-dashed border-border dark:border-white/10 flex justify-end relative z-10">
                                    <button 
                                        onClick={() => handleCopy(coupon.code)}
                                        className="text-sm font-bold text-primary flex items-center gap-2 hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Copy size={16} />
                                        Copy Code
                                    </button>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Coupons;
