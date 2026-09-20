import { Gift, Plus, Copy, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useState } from 'react';
import Swal from 'sweetalert2';

const GiftCards = () => {
    const [giftCards] = useState([
        { id: 1, code: 'GIFT-UDRA-9921', balance: 500, expiry: '2026-12-31', status: 'ACTIVE' },
        { id: 2, code: 'GIFT-FEST-4432', balance: 0, expiry: '2025-10-15', status: 'USED' },
    ]);

    const [newCode, setNewCode] = useState('');

    const handleRedeem = (e) => {
        e.preventDefault();
        if (!newCode.trim()) return;

        Swal.fire({
            icon: 'error',
            title: 'Invalid Code',
            text: 'The gift card code you entered is invalid or expired.',
        });
        setNewCode('');
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        Swal.fire({
            icon: 'success',
            title: 'Copied!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Gift className="w-8 h-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold text-text-primary dark:text-text-onDark">Gift Cards</h1>
                    <p className="text-sm text-text-secondary">Redeem and manage your UdraKala gift cards.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Redeem Section */}
                <div className="lg:col-span-1">
                    <Card className="bg-bg-surface dark:bg-[#1A1A1A] border-border dark:border-white/5 sticky top-24">
                        <h2 className="text-lg font-bold text-text-primary dark:text-text-onDark mb-4">Add Gift Card</h2>
                        <form onSubmit={handleRedeem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Gift Card Code</label>
                                <input
                                    type="text"
                                    value={newCode}
                                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                                    placeholder="Enter 12-digit code"
                                    className="w-full px-4 py-3 rounded-lg bg-bg-page dark:bg-bg-dark border border-border dark:border-border text-text-primary dark:text-text-onDark focus:ring-2 focus:ring-primary outline-none transition font-mono tracking-widest uppercase"
                                />
                            </div>
                            <Button type="submit" className="w-full flex justify-center items-center gap-2">
                                <Plus size={18} /> Redeem to Wallet
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Gift Cards List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-text-primary dark:text-text-onDark mb-4">Your Cards</h2>
                    
                    {giftCards.length === 0 ? (
                        <Card className="text-center py-12 text-text-secondary">
                            You have no gift cards.
                        </Card>
                    ) : (
                        giftCards.map(card => (
                            <div key={card.id} className="relative group overflow-hidden rounded-2xl">
                                {/* Glassmorphic Background */}
                                <div className="absolute inset-0 bg-bg-surface/80 dark:bg-bg-dark/80 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-glass dark:shadow-glass-dark z-0" />
                                
                                {/* Decorative elements */}
                                {card.status === 'ACTIVE' && (
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl z-0" />
                                )}
                                
                                <div className="relative z-10 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                            card.status === 'ACTIVE' ? 'bg-primary/10 text-primary' : 'bg-bg-page dark:bg-white/5 text-text-secondary'
                                        }`}>
                                            <Gift size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono font-bold text-text-primary dark:text-text-onDark tracking-wider">{card.code}</span>
                                                {card.status === 'ACTIVE' && (
                                                    <button onClick={() => handleCopy(card.code)} className="text-text-secondary hover:text-primary transition-colors">
                                                        <Copy size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium">
                                                <span className={card.status === 'ACTIVE' ? 'text-status-success flex items-center gap-1' : 'text-text-secondary'}>
                                                    {card.status === 'ACTIVE' && <CheckCircle2 size={12} />}
                                                    {card.status}
                                                </span>
                                                <span className="text-border dark:text-white/10">•</span>
                                                <span className="text-text-secondary">Expires: {new Date(card.expiry).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 border-border dark:border-white/10 pt-4 md:pt-0">
                                        <p className="text-sm text-text-secondary mb-1">Balance</p>
                                        <p className={`text-2xl font-black ${card.status === 'ACTIVE' ? 'text-primary' : 'text-text-secondary line-through opacity-50'}`}>
                                            ₹{card.balance.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default GiftCards;
