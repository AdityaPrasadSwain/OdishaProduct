import { motion as Motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroZone = () => {
    return (
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-white pt-20 transition-colors duration-200">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-orange-600/20 rounded-[100%] blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-900/10 rounded-[100%] blur-[100px] pointer-events-none" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium mb-8 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        New Collection Live
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-white/60">
                        Weaving Heritage <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">Into Modernity.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                        Discover the finest Sambalpuri sarees, Pattachitra art, and authentic Odisha handlooms.
                        Directly from master artisans to your wardrobe.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/products"
                            className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100 rounded-full font-bold text-lg transition shadow-lg flex items-center justify-center gap-2"
                        >
                            Explore Store <ArrowRight size={20} />
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 bg-gray-100 border border-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10 rounded-full font-bold text-lg transition backdrop-blur-md flex items-center justify-center gap-2">
                            <Play size={18} fill="currentColor" /> Watch Story
                        </button>
                    </div>
                </Motion.div>

                {/* Dashboard / Product Preview Mockup */}

            </div>
        </div>
    );
};

export default HeroZone;
