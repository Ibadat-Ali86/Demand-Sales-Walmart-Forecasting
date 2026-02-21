import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const titles = [
    { text: "Intelligent Analytics", gradient: "from-[#4A9EFF] via-[#B794F6] to-[#4A9EFF]" },
    { text: "Demand Forecasting", gradient: "from-[#10B981] via-[#34D399] to-[#2DD4BF]" },
    { text: "Inventory Optimization", gradient: "from-[#F59E0B] via-[#FBBF24] to-[#F87171]" },
    { text: "Sales Prediction", gradient: "from-[#EC4899] via-[#8B5CF6] to-[#6366F1]" }
];

const AnimatedText = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % titles.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className="inline-block relative w-full h-[1.2em] overflow-visible perspective-1000">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)', rotateX: 45 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: 'blur(0px)',
                        rotateX: 0,
                        backgroundPosition: ["0%", "100%", "0%"]
                    }}
                    exit={{ opacity: 0, y: -30, scale: 1.1, filter: 'blur(10px)', rotateX: -45 }}
                    transition={{
                        type: "spring", stiffness: 200, damping: 20,
                        backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" }
                    }}
                    className={`absolute inset-0 w-full text-left bg-gradient-to-r ${titles[index].gradient} bg-[length:200%_auto] text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]`}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {titles[index].text}
                </motion.div>
            </AnimatePresence>
        </span>
    );
};

export default AnimatedText;
