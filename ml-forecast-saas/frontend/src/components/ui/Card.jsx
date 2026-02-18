/**
 * Core Card Component - Enterprise Design System
 * Flexible card with variants for different use cases
 */

import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
    children,
    variant = 'default',
    hoverable = true,
    className = '',
    ...props
}) => {
    const baseStyles = 'bg-surface-default border border-border-default rounded-lg transition-all duration-200';

    const variants = {
        default: 'p-6 shadow-sm',
        feature: 'p-8 shadow-sm relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-brand-500 before:to-brand-400 before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300',
        kpi: 'p-6 bg-gradient-to-br from-surface-default to-bg-tertiary shadow-sm'
    };

    const hoverStyles = hoverable
        ? 'hover:border-border-hover hover:shadow-md hover:-translate-y-1'
        : '';

    const classes = `${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`;

    if (hoverable) {
        return (
            <motion.div
                className={classes}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

// Card Header Subcomponent
Card.Header = ({ children, className = '' }) => (
    <div className={`flex justify-between items-center mb-4 pb-4 border-b border-border-default ${className}`}>
        {children}
    </div>
);

// Card Title Subcomponent
Card.Title = ({ children, className = '' }) => (
    <h3 className={`font-display text-xl font-semibold text-text-primary ${className}`}>
        {children}
    </h3>
);

// Card Body Subcomponent
Card.Body = ({ children, className = '' }) => (
    <div className={`py-4 ${className}`}>
        {children}
    </div>
);

// Card Footer Subcomponent
Card.Footer = ({ children, className = '' }) => (
    <div className={`pt-4 border-t border-border-default ${className}`}>
        {children}
    </div>
);

export default Card;
