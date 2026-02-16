/**
 * AuthLayout Component
 * Exceptional authentication layout with 3D effects, particles, and animations
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { TrendingUp, TrendingUpIcon, ShieldCheck, ArrowUpRight, CheckCircle } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import FloatingOrbs from './FloatingOrbs';
import StatsCard3D from './StatsCard3D';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

const AuthLayout = ({ children, mode = 'signin' }) => {
    const [activeTab, setActiveTab] = useState(mode);

    // Initialize smooth scroll
    useSmoothScroll();

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

    const statsData = [
        {
            icon: {
                component: TrendingUpIcon,
                gradient: 'from-green-400 to-emerald-600',
                shadow: 'shadow-green-500/30'
            },
            title: 'Forecast Accuracy',
            value: '98.7%',
            trend: {
                icon: ArrowUpRight,
                value: '+2.4%',
                color: 'text-green-600'
            },
            trendText: 'vs last month',
            delay: 0.2
        },
        {
            icon: {
                component: ShieldCheck,
                gradient: 'from-purple-400 to-indigo-600',
                shadow: 'shadow-purple-500/30'
            },
            title: 'Enterprise Security',
            value: 'SOC2 Ready',
            trend: {
                icon: CheckCircle,
                value: 'Certified',
                color: 'text-purple-600'
            },
            trendText: 'Last audit: Dec 2025',
            delay: 0.4
        }
    ];

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-slate-50">
            {/* Background Effects */}
            <FloatingOrbs />
            <ParticleBackground />

            {/* Grid Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid opacity-50" />
            </div>

            {/* Left Panel - Branding (40%) */}
            <div className="hidden lg:flex lg:w-5/12 relative z-10 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">

                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-pattern opacity-20" />
                </div>

                {/* Top Section */}
                <div className="relative z-10 reveal-up opacity-0 translate-y-8">
                    <Link to="/" className="flex items-center space-x-3 mb-8 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
                            <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <span className="font-display text-2xl font-bold tracking-tight">ForecastAI</span>
                    </Link>

                    <div className="space-y-6">
                        <h1 className="font-display text-5xl font-bold leading-tight">
                            Build the future with<br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                                Intelligent Forecasting
                            </span>
                        </h1>
                        <p className="text-lg text-blue-100/80 max-w-md leading-relaxed">
                            Enterprise-grade demand intelligence that reduces stockouts by 30% and optimizes inventory with 98.7% accuracy.
                        </p>
                    </div>
                </div>

                {/* Middle Section - Animated Stats Cards */}
                <div className="relative z-10 space-y-4 my-8">
                    {statsData.map((stat, index) => (
                        <div key={index} className="reveal-up opacity-0 translate-y-8">
                            <StatsCard3D {...stat} />
                        </div>
                    ))}
                </div>

                {/* Bottom Section - Social Proof */}
                <div className="relative z-10 reveal-up opacity-0 translate-y-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <img
                                    key={i}
                                    src={`https://i.pravatar.cc/100?img=${i}`}
                                    className="w-10 h-10 rounded-full border-2 border-slate-900 shadow-md"
                                    alt={`User ${i}`}
                                />
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shadow-md">
                                +2k
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-blue-100/70">
                        Trusted by <span className="font-semibold text-white">500+ retailers</span> worldwide including Fortune 500 companies
                    </p>
                </div>
            </div>

            {/* Right Panel - Form Content (60%) */}
            <div className="w-full lg:w-7/12 relative z-10 flex items-center justify-center p-6 lg:p-12">
                {children}
            </div>

            {/* Styles */}
            <style jsx>{`
        .bg-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
          mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
        }

        .bg-pattern {
          background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
        </div>
    );
};

export default AuthLayout;
