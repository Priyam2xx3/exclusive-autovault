import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';

const Home = () => {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image/Video Fallback */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/80 to-dark-900 z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
                        alt="Luxury Car Showcase"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-heading font-extrabold mb-6 tracking-tight"
                    >
                        The Ultimate <br />
                        <span className="gold-gradient text-glow">Curated Collection</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
                    >
                        Discover, admire, and purchase ultra-high resolution photography of the world's most exclusive classic and modern vehicles.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link to="/category/all" className="bg-gold-500 text-dark-900 hover:bg-gold-400 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                            Explore Collection <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link to="/category/premium" className="glass px-8 py-4 rounded-full font-bold text-lg text-white hover:bg-white/10 transition-all flex items-center justify-center">
                            View Premium
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Featured Categories/Benefits */}
            <section className="py-24 bg-dark-900 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Why <span className="text-gold-500">AutoVault?</span></h2>
                        <div className="h-1 w-20 bg-gold-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div whileHover={{ y: -10 }} className="glass-card p-8 rounded-2xl text-center">
                            <div className="mx-auto bg-dark-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-gold-500 border border-white/10">
                                <Star className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Ultra High Resolution</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">Every image in our vault is meticulously curated to provide maximum clarity, perfect for desktop wallpapers or professional prints.</p>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="glass-card p-8 rounded-2xl text-center">
                            <div className="mx-auto bg-dark-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-gold-500 border border-white/10">
                                <Shield className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Exclusive Access</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">Gain access to rare photos of one-off hypercars and untouched vintage classics that you won't find anywhere else.</p>
                        </motion.div>

                        <motion.div whileHover={{ y: -10 }} className="glass-card p-8 rounded-2xl text-center">
                            <div className="mx-auto bg-dark-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-gold-500 border border-white/10">
                                <Zap className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Instant Downloads</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">Purchase premium images securely via Stripe and receive instant access to full quality, unwatermarked files directly to your vault.</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
