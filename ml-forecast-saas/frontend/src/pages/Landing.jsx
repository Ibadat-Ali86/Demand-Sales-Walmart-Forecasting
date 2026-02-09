import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, Sliders, Shield, Zap, Users, ArrowRight, CheckCircle, Play, ChevronDown, Building2, Award, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const Landing = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const stats = [
        { value: 98.77, label: 'Forecast Accuracy', suffix: '%', prefix: '' },
        { value: 500, label: 'Enterprise Clients', suffix: '+', prefix: '' },
        { value: 10, label: 'Daily Predictions', suffix: 'M+', prefix: '' },
    ];

    const features = [
        {
            icon: TrendingUp,
            title: 'AI-Powered Forecasting',
            description: 'Leverage XGBoost, LSTM, and Prophet models for highly accurate demand predictions.',
            iconBg: 'bg-primary-100',
            iconColor: 'text-primary-600',
        },
        {
            icon: BarChart3,
            title: 'Interactive Dashboards',
            description: 'Visualize trends and forecasts with beautiful, real-time charts.',
            iconBg: 'bg-secondary-100',
            iconColor: 'text-secondary-600',
        },
        {
            icon: Sliders,
            title: 'Scenario Planning',
            description: 'Run what-if analyses to optimize inventory and reduce costs.',
            iconBg: 'bg-success-100',
            iconColor: 'text-success-600',
        },
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'Bank-level encryption, SOC 2 compliance, and GDPR-ready.',
            iconBg: 'bg-warning-100',
            iconColor: 'text-warning-600',
        },
        {
            icon: Zap,
            title: 'Real-time Updates',
            description: 'Get instant forecast updates with 24/7 automated processing.',
            iconBg: 'bg-info-100',
            iconColor: 'text-info-600',
        },
        {
            icon: Users,
            title: 'Team Collaboration',
            description: 'Share insights and align your team on demand strategy.',
            iconBg: 'bg-primary-100',
            iconColor: 'text-primary-600',
        },
    ];

    const trustedLogos = [
        { name: 'Walmart', icon: Building2 },
        { name: 'Amazon', icon: Building2 },
        { name: 'Target', icon: Building2 },
        { name: 'Costco', icon: Building2 },
    ];

    // Animated counter hook
    const AnimatedCounter = ({ value, suffix = '', prefix = '' }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            let start = 0;
            const increment = value / 60;
            const timer = setInterval(() => {
                start += increment;
                if (start >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start * 100) / 100);
                }
            }, 30);
            return () => clearInterval(timer);
        }, [value]);

        return <span>{prefix}{typeof value === 'number' && value % 1 !== 0 ? count.toFixed(2) : Math.floor(count)}{suffix}</span>;
    };

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Fixed Navigation - Light Mode */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold font-display text-gray-900">ForecastAI</span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-8">
                            <a href="#features" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Features</a>
                            <a href="#stats" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Results</a>
                            <a href="#cta" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Pricing</a>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link to="/login" className="hidden sm:inline-flex px-4 py-2 text-gray-700 font-medium hover:text-primary-600 transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-sm">
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Light Mode */}
            <section className="pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Subtle background gradients */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30"
                        style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)' }} />
                    <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
                        style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)' }} />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center lg:text-left"
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-8"
                            >
                                <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                                <span className="text-sm font-medium text-primary-700">
                                    Powered by Advanced ML Models
                                </span>
                            </motion.div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-gray-900 mb-6 leading-tight">
                                Transform Sales Data Into{' '}
                                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                    Accurate Forecasts
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                ML-powered forecasting platform that helps businesses reduce stockouts by 80% and save millions in operational costs.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-md hover:shadow-lg group">
                                    <span>Start Free Trial</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-300 hover:border-primary-500 hover:bg-gray-50 transition-all">
                                    <Play className="w-5 h-5" />
                                    <span>Watch Demo</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start text-sm text-gray-500">
                                <span className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-success-500" />
                                    No credit card required
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-success-500" />
                                    14-day free trial
                                </span>
                            </div>
                        </motion.div>

                        {/* Hero Dashboard Preview - Light Mode */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="hidden lg:block"
                        >
                            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 relative">
                                {/* Card header */}
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                            <BarChart3 className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Demand Forecast</div>
                                            <div className="text-sm text-gray-500">Real-time predictions</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
                                        LIVE
                                    </div>
                                </div>

                                {/* Chart placeholder */}
                                <div className="h-44 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden bg-gray-50">
                                    <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
                                        {[40, 65, 45, 80, 55, 70, 90, 60].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                                className={`w-6 rounded-t ${i === 6 ? 'bg-gradient-to-t from-primary-500 to-primary-400' : 'bg-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-4 rounded-lg text-center bg-gray-50 border border-gray-100">
                                        <div className="text-2xl font-bold font-mono text-primary-600">98.77%</div>
                                        <div className="text-xs mt-1 text-gray-500">Accuracy</div>
                                    </div>
                                    <div className="p-4 rounded-lg text-center bg-gray-50 border border-gray-100">
                                        <div className="text-2xl font-bold font-mono text-success-600">$2.5M</div>
                                        <div className="text-xs mt-1 text-gray-500">Saved</div>
                                    </div>
                                    <div className="p-4 rounded-lg text-center bg-gray-50 border border-gray-100">
                                        <div className="text-2xl font-bold font-mono text-secondary-600">-80%</div>
                                        <div className="text-xs mt-1 text-gray-500">Stockouts</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                </motion.div>
            </section>

            {/* Trust Indicators Section */}
            <section className="py-12 bg-gray-50 border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500 mb-8">Trusted by leading enterprises worldwide</p>
                    <div className="flex items-center justify-center gap-12 flex-wrap opacity-60">
                        {trustedLogos.map((logo, index) => (
                            <div key={index} className="flex items-center gap-2 text-gray-400">
                                <logo.icon className="w-8 h-8" />
                                <span className="font-semibold text-lg">{logo.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-20 sm:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="text-center"
                            >
                                <div className="text-5xl sm:text-6xl font-bold font-mono bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                                </div>
                                <div className="text-lg text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
                                <Zap className="w-4 h-4 mr-1" />
                                Features
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 mb-4">
                                Everything you need for{' '}
                                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">intelligent forecasting</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Advanced ML models combined with intuitive dashboards and real-time insights
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 group"
                            >
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.iconBg} transition-transform group-hover:scale-110`}>
                                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-600">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-6">
                            Ready to transform your forecasting?
                        </h2>
                        <p className="text-xl text-white/80 mb-10">
                            Join 500+ companies using AI to optimize their supply chain
                        </p>
                        <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg">
                            Start Free Trial
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500">
                            <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold">ForecastAI</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a>
                    </div>
                    <p className="text-sm text-gray-400">
                        © 2026 ForecastAI. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
