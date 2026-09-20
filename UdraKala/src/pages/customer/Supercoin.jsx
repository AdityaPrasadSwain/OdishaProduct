import { Coins, TrendingUp, History, Gift, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Supercoin = () => {
    // Mock data for UI
    const balance = 1250;
    const history = [
        { id: 1, type: 'EARNED', amount: 50, date: '2026-06-20', description: 'Order #892134 Delivered' },
        { id: 2, type: 'SPENT', amount: 200, date: '2026-06-15', description: 'Discount applied on Order #891102' },
        { id: 3, type: 'EARNED', amount: 100, date: '2026-06-10', description: 'Bonus for writing 5 reviews' },
        { id: 4, type: 'EARNED', amount: 30, date: '2026-06-05', description: 'Order #889921 Delivered' },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-bg-surface dark:to-bg-dark border-yellow-500/30 relative overflow-hidden flex flex-col justify-center min-h-[200px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-yellow-600 dark:text-yellow-400 font-bold">
                            <Coins size={20} />
                            <span>Supercoin Balance</span>
                        </div>
                        <div className="text-5xl md:text-7xl font-black text-text-primary dark:text-text-onDark tracking-tight mb-4 flex items-baseline gap-2">
                            {balance}
                            <span className="text-lg font-medium text-text-secondary">Coins</span>
                        </div>
                        <p className="text-sm text-text-secondary max-w-md">
                            You can use Supercoins to claim exciting rewards, get discounts on your orders, or buy exclusive products.
                        </p>
                    </div>
                </Card>

                <Card className="flex flex-col justify-between min-h-[200px] border-primary/20 bg-primary/5">
                    <div>
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                            <Gift size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary dark:text-text-onDark mb-2">Claim Rewards</h3>
                        <p className="text-sm text-text-secondary mb-4">Explore our rewards catalog and use your coins to claim gift cards, subscriptions, and more!</p>
                    </div>
                    <Button className="w-full flex justify-between items-center group">
                        Explore Rewards
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Card>
            </div>

            {/* History Section */}
            <Card>
                <div className="flex items-center gap-2 mb-6 border-b border-border dark:border-border pb-4">
                    <History size={20} className="text-primary" />
                    <h2 className="text-xl font-bold text-text-primary dark:text-text-onDark">Coin History</h2>
                </div>

                <div className="space-y-4">
                    {history.length === 0 ? (
                        <div className="text-center py-8 text-text-secondary">
                            No coin history found.
                        </div>
                    ) : (
                        history.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-bg-page dark:hover:bg-white/5 transition-colors border border-transparent hover:border-border/50">
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 flex items-center justify-center w-8 h-8 rounded-full ${
                                        item.type === 'EARNED' ? 'bg-status-success/10 text-status-success' : 'bg-status-error/10 text-status-error'
                                    }`}>
                                        <TrendingUp size={16} className={item.type === 'SPENT' ? 'rotate-180' : ''} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-text-primary dark:text-text-onDark">{item.description}</p>
                                        <p className="text-xs text-text-secondary mt-1">{new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className={`font-bold text-lg ${
                                    item.type === 'EARNED' ? 'text-status-success' : 'text-text-primary dark:text-text-onDark'
                                }`}>
                                    {item.type === 'EARNED' ? '+' : '-'}{item.amount}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Supercoin;
