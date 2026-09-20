import { Wallet as WalletIcon, CreditCard, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Wallet = () => {
    // Mock Data
    const walletBalance = 4500.50;
    const savedCards = [
        { id: 1, type: 'Visa', last4: '4242', expiry: '12/28', isDefault: true, color: 'from-blue-600 to-blue-900' },
        { id: 2, type: 'Mastercard', last4: '8811', expiry: '08/26', isDefault: false, color: 'from-orange-500 to-red-600' }
    ];

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <WalletIcon className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary dark:text-text-onDark">Wallet & Cards</h1>
                        <p className="text-sm text-text-secondary">Manage your balances and payment methods.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Wallet Balance */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-bg-surface dark:bg-[#1A1A1A] border-border dark:border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                        
                        <div className="relative z-10">
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Total Balance</h3>
                            <div className="text-4xl font-black text-text-primary dark:text-text-onDark mb-6">
                                ₹{walletBalance.toFixed(2)}
                            </div>
                            
                            <div className="flex gap-3">
                                <Button className="flex-1 flex justify-center items-center gap-2">
                                    <ArrowDownLeft size={16} /> Top Up
                                </Button>
                                <Button variant="outline" className="flex-1 flex justify-center items-center gap-2">
                                    <ArrowUpRight size={16} /> Transfer
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Saved Cards */}
                <div className="lg:col-span-2">
                    <Card className="h-full bg-bg-surface dark:bg-[#121212] border-border dark:border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-text-primary dark:text-text-onDark">Saved Cards</h2>
                            <button className="text-sm font-bold text-primary flex items-center gap-1 hover:text-primary-dark transition-colors">
                                <Plus size={16} /> Add New Card
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {savedCards.map(card => (
                                <div key={card.id} className={`relative rounded-2xl p-6 text-white overflow-hidden shadow-lg bg-gradient-to-br ${card.color} transition-transform hover:-translate-y-1`}>
                                    {/* Decorative Card Elements */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -mr-10 -mt-10 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none" />
                                    
                                    <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                                        <div className="flex justify-between items-start">
                                            <CreditCard size={28} className="opacity-80" />
                                            {card.isDefault && (
                                                <span className="text-[10px] uppercase tracking-wider font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <div className="text-xl font-mono tracking-widest mb-1 opacity-90 drop-shadow-md">
                                                •••• •••• •••• {card.last4}
                                            </div>
                                            <div className="flex justify-between text-xs font-medium opacity-80">
                                                <span>{card.type}</span>
                                                <span>Exp: {card.expiry}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
