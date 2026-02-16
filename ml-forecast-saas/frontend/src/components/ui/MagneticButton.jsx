import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, className = '', onClick, type = 'button', ...props }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [ripples, setRipples] = useState([]);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        // Magnetic pull factor (0.3 = subtle, 1 = follows cursor exactly)
        setPosition({ x: x * 0.3, y: y * 0.3 });

        // Update custom props for potential CSS usage (e.g. sheen)
        ref.current.style.setProperty('--x', `${clientX - left}px`);
        ref.current.style.setProperty('--y', `${clientY - top}px`);
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const createRipple = (e) => {
        const button = ref.current;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const newRipple = { x, y, size, id: Date.now() };
        setRipples((prev) => [...prev, newRipple]);

        if (onClick) onClick(e);
    };

    // Remove ripple after animation
    const removeRipple = (id) => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
    };

    return (
        <motion.button
            ref={ref}
            type={type}
            className={`relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            onClick={createRipple}
            {...props}
        >
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="absolute bg-white/30 rounded-full pointer-events-none animate-ripple"
                    style={{
                        top: ripple.y,
                        left: ripple.x,
                        width: ripple.size,
                        height: ripple.size,
                        transform: 'scale(0)',
                    }}
                    onAnimationEnd={() => removeRipple(ripple.id)}
                />
            ))}
            <span className="relative z-10">{children}</span>
            <style jsx>{`
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                .animate-ripple {
                    animation: ripple 0.6s linear;
                }
            `}</style>
        </motion.button>
    );
};

export default MagneticButton;
