import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { TrendingUp } from 'lucide-react';
import ParticleCanvas from '../ui/ParticleCanvas';
import AnimatedChartPreview from './AnimatedChartPreview';
import TrustSignals from './TrustSignals';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

const AuthLayout = ({ children }) => {
    // Initialize smooth scroll
    // useSmoothScroll();

    // GSAP entrance animations
    useEffect(() => {
        gsap.to('.reveal-up', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.2
        });
    }, []);

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-bg-secondary text-text-primary font-sans">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Gradient Orbs */}
                <div className="orb w-96 h-96 bg-brand-400/10 rounded-full blur-3xl absolute top-0 left-0 animate-float" style={{ animationDelay: '0s' }}></div>
                <div className="orb w-80 h-80 bg-accent-400/10 rounded-full blur-3xl absolute bottom-0 right-0 animate-float" style={{ animationDelay: '2s' }}></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-grid opacity-[0.02]" />

                {/* Particle Canvas */}
                <ParticleCanvas />
            </div>

            {/* Left Panel - Branding (45%) */}
            <div className="hidden lg:flex lg:w-[45%] relative z-10 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 text-white overflow-hidden shadow-2xl">

                {/* Animated Background for Left Panel */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-pattern" />
                </div>

                {/* Top Section */}
                <div className="relative z-10 reveal-up opacity-0 translate-y-8">
                    <Link to="/" className="flex items-center space-x-3 mb-8 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 transition-transform group-hover:scale-105">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-display text-2xl font-bold tracking-tight text-white">AdaptIQ</span>
                    </Link>

                    <div className="space-y-4">
                        <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight">
                            Predict the future with<br />
                            <span className="gradient-text-animated">Intelligent Analytics</span>
                        </h1>
                        <p className="text-lg text-brand-100/80 max-w-md leading-relaxed">
                            Enterprise-grade demand forecasting powered by advanced machine learning models.
                        </p>
                    </div>
                </div>

                {/* Middle Section - Animated Chart Preview */}
                <div className="relative z-10 my-8 reveal-up opacity-0 translate-y-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-accent-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                            <AnimatedChartPreview />
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Trust Signals */}
                <div className="relative z-10 reveal-up opacity-0 translate-y-8">
                    <TrustSignals />
                </div>
            </div>

            {/* Right Panel - Form Wrap (55%) */}
            <div className="w-full lg:w-[55%] relative z-10 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto bg-bg-primary/50 backdrop-blur-sm">
                {/* Mobile Header (Visible only on small screens) */}
                <div className="lg:hidden mb-8 w-full max-w-md flex flex-col items-center text-center">
                    <Link to="/" className="flex items-center space-x-3 mb-6 group">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-display text-xl font-bold tracking-tight text-slate-900">AdaptIQ</span>
                    </Link>
                </div>

                {children}
            </div>

            {/* Styles */}
            <style jsx>{`
                .bg-grid {
                    background-size: 40px 40px;
                    background-image: linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
                    mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
                }
                .bg-pattern {
                    background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
                }
                .gradient-text-animated {
                    background: linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #F472B6 100%);
                    background-size: 200% 200%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: gradient-x 3s ease infinite;
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .font-display {
                    font-family: 'Plus Jakarta Sans', var(--font-sans), sans-serif;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    );
};

export default AuthLayout;
