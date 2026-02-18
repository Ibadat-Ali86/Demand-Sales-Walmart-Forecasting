import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '../ui/Card';

const KPICard = ({ title, value, change, trend, icon: Icon, color = 'primary' }) => {
    // Determine trend color and icon
    const isPositive = trend === 'up';
    const isNeutral = trend === 'neutral';

    // Map colors to theme variables (using Tailwind classes)
    const colorMap = {
        primary: 'text-brand-600 bg-brand-50',
        success: 'text-emerald-600 bg-emerald-50',
        warning: 'text-amber-600 bg-amber-50',
        danger: 'text-red-600 bg-red-50',
        info: 'text-cyan-600 bg-cyan-50',
        purple: 'text-purple-600 bg-purple-50'
    };

    const iconStyle = colorMap[color] || colorMap.primary;

    return (
        <Card variant="kpi" className="group relative overflow-hidden">
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${iconStyle}`}>
                    <Icon className="w-6 h-6" />
                </div>

                {change && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${isPositive
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : isNeutral
                            ? 'bg-slate-50 text-slate-600 border-slate-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : isNeutral ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{change}</span>
                    </div>
                )}
            </div>

            <h3 className="text-sm font-medium mb-1 text-text-secondary">{title}</h3>
            <p className="text-2xl font-bold font-display tracking-tight text-text-primary">{value}</p>

            {/* Decorative background element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-current opacity-5 blur-2xl text-brand-500 pointer-events-none" />
        </Card>
    );
};

export default KPICard;
