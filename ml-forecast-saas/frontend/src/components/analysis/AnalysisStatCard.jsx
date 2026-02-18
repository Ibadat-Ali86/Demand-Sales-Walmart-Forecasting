import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const AnalysisStatCard = ({ label, value, icon: Icon, color = 'blue', delay = 0 }) => {
    const cardRef = useRef(null);
    const innerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current || !innerRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10; // Simple tilt
        const rotateY = (centerX - x) / 10;

        innerRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
        if (!innerRef.current) return;
        innerRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };

    const colorStyles = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-100',
            iconBg: 'bg-blue-100',
            gradient: 'from-blue-500 to-indigo-600'
        },
        purple: {
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            border: 'border-purple-100',
            iconBg: 'bg-purple-100',
            gradient: 'from-purple-500 to-pink-600'
        },
        green: {
            bg: 'bg-green-50',
            text: 'text-green-600',
            border: 'border-green-100',
            iconBg: 'bg-green-100',
            gradient: 'from-emerald-500 to-teal-600'
        },
        yellow: {
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            border: 'border-amber-100',
            iconBg: 'bg-amber-100',
            gradient: 'from-amber-400 to-orange-500'
        },
        red: {
            bg: 'bg-red-50',
            text: 'text-red-600',
            border: 'border-red-100',
            iconBg: 'bg-red-100',
            gradient: 'from-red-500 to-rose-600'
        }
    };

    const theme = colorStyles[color] || colorStyles.blue;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative h-full"
        >
            <div
                ref={innerRef}
                className="h-full bg-white rounded-2xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 transition-transform duration-200 ease-out"
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${theme.iconBg} text-white shadow-lg`}>
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${theme.gradient} opacity-90`} />
                        <div className="relative z-10">
                            {Icon}
                        </div>
                    </div>
                    {/* Optional Trend Indicator could go here */}
                </div>

                <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                    <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
                </div>

                {/* Decorative background element */}
                <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${theme.gradient} opacity-5 blur-2xl`} />
            </div>
        </motion.div>
    );
};

export default AnalysisStatCard;
