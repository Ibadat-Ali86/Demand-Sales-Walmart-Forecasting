import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Brain,
    History,
    Target,
    FileText,
    BarChart3,
    Upload,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    LogOut,
    Settings,
    HelpCircle,
    Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Navigation organized by workflow order
const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/upload', label: 'Upload Data', icon: Upload },
    { path: '/analysis', label: 'Analysis', icon: Brain },
    { path: '/monitoring', label: 'Monitor', icon: Activity },
    { path: '/forecast-explorer', label: 'Forecasts', icon: History },
    { path: '/scenario-simulator', label: 'Scenarios', icon: Target },
    { path: '/scenario-planning', label: 'Planning', icon: BarChart3 },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/executive', label: 'Executive', icon: BarChart3 },
];

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside
            className={`hidden md:flex ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out fixed inset-y-0 left-0 z-50 flex-col border-r border-border-subtle shadow-xl bg-bg-secondary`}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border-subtle bg-bg-secondary/95 backdrop-blur-sm">
                <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg bg-gradient-to-br from-brand-500 to-brand-700">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-bold tracking-tight text-text-primary font-display">AdaptIQ</span>
                    )}
                </div>
            </div>

            {/* Collapse Button (Absolute position to overlap border) */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 bg-bg-secondary border border-border-subtle rounded-full p-1 text-text-tertiary hover:text-brand-600 hover:border-brand-200 shadow-sm transition-all z-50"
            >
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-thin">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative overflow-hidden ${isActive
                                ? 'bg-brand-50 text-brand-600 font-medium'
                                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                            } ${isCollapsed ? 'justify-center' : ''}`
                        }
                        title={isCollapsed ? item.label : undefined}
                    >
                        <item.icon
                            className={`w-5 h-5 flex-shrink-0 transition-colors ${isCollapsed ? '' : 'mr-1'
                                }`}
                        />

                        {!isCollapsed && (
                            <span className="truncate">{item.label}</span>
                        )}

                        {/* Active indicator */}
                        {({ isActive }) => isActive && !isCollapsed && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full bg-brand-500" />
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User & Footer Section */}
            <div className="p-4 border-t border-border-subtle bg-bg-secondary space-y-2">
                {!isCollapsed && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-tertiary border border-border-subtle mb-2">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-brand-400 to-accent-500 text-white font-bold text-sm shadow-sm">
                            {user?.full_name?.charAt(0) || <User className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-text-primary">
                                {user?.full_name || 'Demo User'}
                            </p>
                            <p className="text-xs truncate text-text-tertiary">
                                {user?.role || 'Viewer'}
                            </p>
                        </div>
                    </div>
                )}

                <div className={`flex ${isCollapsed ? 'flex-col gap-2' : 'justify-between'}`}>
                    <button
                        className={`p-2 rounded-lg text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
                        title="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                    <button
                        className={`p-2 rounded-lg text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
                        title="Help"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleLogout}
                        className={`p-2 rounded-lg text-text-secondary hover:bg-red-50 hover:text-red-600 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
