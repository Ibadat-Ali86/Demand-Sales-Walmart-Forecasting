import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';


import CommandPalette from '../ui/CommandPalette';

const Layout = ({ children, title }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isCommandOpen, setIsCommandOpen] = useState(false);

    // Toggle Command Palette with Cmd+K / Ctrl+K
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsCommandOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="flex min-h-screen bg-bg-primary text-text-primary relative overflow-hidden font-sans antialiased">
            <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

            {/* Background Mesh Gradient - Subtle ambient light */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-500/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-500/5 blur-[120px]" />
            </div>

            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out relative z-10 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                <Header title={title} />

                <main className="flex-1 p-6 lg:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-7xl mx-auto space-y-6"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
