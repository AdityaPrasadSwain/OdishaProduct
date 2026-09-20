import { Zap, CheckCircle2, Truck, Clock, Tag, Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PlusZone = () => {
    // Mock user status
    const isMember = false;

    const benefits = [
        { icon: Truck, title: 'Free Delivery', description: 'Zero shipping charges on all Plus eligible products.' },
        { icon: Clock, title: 'Early Access', description: 'Get exclusive early access to all major sales.' },
        { icon: Tag, title: 'Extra Discounts', description: 'Earn double Supercoins on every purchase.' },
        { icon: Zap, title: 'Priority Support', description: 'Skip the queue with our premium customer service.' },
    ];

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-[#121212] border border-white/10 shadow-glass-dark">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />
                
                <div className="relative z-10 p-8 md:p-12 lg:p-16 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                            <Sparkles size={16} className="text-yellow-400" />
                            <span className="text-sm font-bold text-white tracking-widest uppercase">Premium Membership</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            UdraKala <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-primary">Plus</span>
                        </h1>
                        
                        <p className="text-lg text-white/80 max-w-xl mx-auto md:mx-0">
                            Upgrade your shopping experience. Join UdraKala Plus today to unlock exclusive benefits, free shipping, and priority support.
                        </p>
                        
                        <div className="pt-4">
                            {isMember ? (
                                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-status-success/20 border border-status-success/30 text-white backdrop-blur-md">
                                    <CheckCircle2 size={24} className="text-status-success" />
                                    <div>
                                        <div className="font-bold">Active Member</div>
                                        <div className="text-xs text-white/70">Valid until 2027-12-31</div>
                                    </div>
                                </div>
                            ) : (
                                <Button className="bg-white text-purple-900 hover:bg-gray-100 font-bold px-8 py-4 text-lg rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]">
                                    Join Now for ₹499/year
                                </Button>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex-shrink-0 hidden lg:block relative">
                        <div className="w-64 h-64 bg-gradient-to-tr from-purple-600 to-primary rounded-full blur-2xl opacity-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        <Zap size={160} className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] relative z-10" />
                    </div>
                </div>
            </div>

            {/* Benefits Grid */}
            <div>
                <h2 className="text-2xl font-bold text-text-primary dark:text-text-onDark mb-6 text-center md:text-left">Membership Benefits</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, idx) => {
                        const Icon = benefit.icon;
                        return (
                            <Card key={idx} className="bg-bg-surface/50 dark:bg-bg-dark/50 backdrop-blur-md border border-white/10 dark:border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-primary/20 flex items-center justify-center mb-4 text-primary">
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-text-primary dark:text-text-onDark mb-2">{benefit.title}</h3>
                                <p className="text-sm text-text-secondary">{benefit.description}</p>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PlusZone;
