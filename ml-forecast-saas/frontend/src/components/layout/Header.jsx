import React, { useState } from 'react';
import { Bell, Search, Menu, Settings, HelpCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CommandPalette from '../ui/CommandPalette';

const Header = ({ toggleSidebar, isSidebarCollapsed }) => {
    const { user } = useAuth();
    const [isCommandOpen, setIsCommandOpen] = useState(false);

    // Mock notifications (replace with real data later)
    const hasNotifications = true;

    return (
        <header className="h-16 px-6 flex items-center justify-between border-b border-border-subtle bg-bg-secondary sticky top-0 z-40">
            {/* Left: Mobile Toggle & Title/Breadcrumb placeholder */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Search / Command Palette Trigger */}
                <button
                    onClick={() => setIsCommandOpen(true)}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-bg-tertiary border border-border-subtle rounded-md text-text-tertiary hover:text-text-secondary hover:border-border-primary transition-all group"
                >
                    <Search className="w-4 h-4" />
                    <span className="text-sm">Search...</span>
                    <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border-default bg-bg-secondary px-1.5 font-mono text-[10px] font-medium text-text-tertiary group-hover:text-text-secondary">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>
                <button
                    onClick={() => setIsCommandOpen(true)}
                    className="md:hidden p-2 text-text-secondary hover:bg-bg-tertiary rounded-full transition-colors"
                >
                    <Search className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-text-secondary hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    {hasNotifications && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-bg-secondary" />
                    )}
                </button>

                {/* Help (Desktop) */}
                <button className="hidden md:flex p-2 text-text-secondary hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors">
                    <HelpCircle className="w-5 h-5" />
                </button>

                {/* Settings (Desktop) */}
                <button className="hidden md:flex p-2 text-text-secondary hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors">
                    <Settings className="w-5 h-5" />
                </button>

                {/* Profile Dropdown Trigger (Basic) */}
                <div className="ml-2 flex items-center gap-3 pl-4 border-l border-border-subtle">
                    <div className="flex flex-col items-end hidden md:flex">
                        <span className="text-sm font-medium text-text-primary leading-none">
                            {user?.full_name || 'Demo User'}
                        </span>
                        <span className="text-xs text-text-tertiary mt-1">
                            {user?.role || 'Admin'}
                        </span>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-medium shadow-md hover:shadow-lg transition-shadow">
                        {user?.full_name?.charAt(0) || <User className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Command Palette Modal */}
            <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
        </header>
    );
};

export default Header;
