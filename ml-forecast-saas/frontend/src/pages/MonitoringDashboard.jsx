import React, { useState, useEffect } from 'react';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    Server,
    RefreshCw,
    ShieldCheck,
    Zap,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const MonitoringDashboard = () => {
    const { token } = useAuth();
    const { showToast } = useToast();
    const [health, setHealth] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [wsStatus, setWsStatus] = useState('disconnected');

    // Fetch initial data
    const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };

            const [healthRes, metricsRes, alertsRes] = await Promise.all([
                fetch(`${API_URL}/api/monitoring/health`, { headers }),
                fetch(`${API_URL}/api/monitoring/metrics`, { headers }),
                fetch(`${API_URL}/api/monitoring/alerts?limit=5`, { headers })
            ]);

            const healthData = await healthRes.json();
            const metricsData = await metricsRes.json();
            const alertsData = await alertsRes.json();

            setHealth(healthData);
            setMetrics(metricsData);
            setAlerts(alertsData.alerts);
        } catch (error) {
            console.error("Failed to fetch monitoring data:", error);
            showToast("Failed to load monitoring data", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Auto-refresh every 30s
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [token]);

    // WebSocket Connection (Phase 8 Real-time)
    useEffect(() => {
        const clientId = `user:${Math.random().toString(36).substr(2, 9)}`;
        const wsUrl = API_URL.replace('http', 'ws') + `/ws/${clientId}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => setWsStatus('connected');
        ws.onclose = () => setWsStatus('disconnected');
        ws.onerror = () => setWsStatus('error');

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'alert') {
                showToast(data.message, data.severity || 'info');
                fetchData(); // Refresh data on alert
            }
        };

        return () => ws.close();
    }, []);

    const handleRunDriftCheck = async () => {
        setIsChecking(true);
        try {
            // Trigger manual drift check (mock payload for now)
            const res = await fetch(`${API_URL}/api/monitoring/check-drift`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    feature_data: { "sales": [100, 102, 98, 95, 110] }, // Mock
                    predictions: [101, 103, 99, 94, 108]
                })
            });

            const result = await res.json();
            if (result.alert_triggered) {
                showToast(`Drift Detected: ${result.severity}`, "warning");
            } else {
                showToast("System Healthy: No drift detected", "success");
            }
            fetchData();
        } catch (error) {
            showToast("Drift check failed", "error");
        } finally {
            setIsChecking(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-enter">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary font-display flex items-center gap-3">
                        Model Monitoring
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${wsStatus === 'connected'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            {wsStatus === 'connected' ? '● Live' : '○ Offline'}
                        </span>
                    </h1>
                    <p className="text-text-secondary">Real-time health, drift detection, and performance metrics</p>
                </div>
                <button
                    onClick={handleRunDriftCheck}
                    disabled={isChecking}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Activity className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                    {isChecking ? 'Checking...' : 'Run Diagnostics'}
                </button>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Model Health"
                    value={health.status === 'healthy' ? 'Healthy' : 'At Risk'}
                    icon={ShieldCheck}
                    trend={health.status === 'healthy' ? 'positive' : 'negative'}
                    subValue={`Version ${health.model_version}`}
                    color={health.status === 'healthy' ? 'green' : 'red'}
                />
                <MetricCard
                    title="Current MAPE"
                    value={`${health.current_mape}%`}
                    icon={Zap}
                    trend={health.current_mape < health.reference_mape ? 'positive' : 'negative'}
                    subValue={`Target: <${health.reference_mape}%`}
                    color="blue"
                />
                <MetricCard
                    title="Uptime"
                    value={`${health.uptime_hours}h`}
                    icon={Clock}
                    trend="neutral"
                    subValue="Since last restart"
                    color="purple"
                />
                <MetricCard
                    title="Predictions Today"
                    value={health.n_predictions_today}
                    icon={Server}
                    trend="positive"
                    subValue="Total requests"
                    color="orange"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Trend */}
                <div className="lg:col-span-2 bg-bg-secondary border border-border-subtle rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-brand-600" />
                        Performance Trend (MAPE)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics?.trend?.mape_7d?.map((v, i) => ({
                                day: `Day ${i + 1}`,
                                value: v
                            })) || []}>
                                <defs>
                                    <linearGradient id="colorMape" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMape)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerts Feed */}
                <div className="bg-bg-secondary border border-border-subtle rounded-xl p-6 shadow-sm overflow-hidden flex flex-col">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Recent Alerts
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin">
                        {alerts.length === 0 ? (
                            <div className="text-center py-10 text-text-tertiary">
                                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-100" />
                                <p>All systems normal</p>
                            </div>
                        ) : (
                            alerts.map(alert => (
                                <div key={alert.id} className={`p-3 rounded-lg border ${alert.severity === 'critical' ? 'bg-red-50 border-red-100' :
                                        alert.severity === 'high' ? 'bg-orange-50 border-orange-100' :
                                            'bg-blue-50 border-blue-100'
                                    }`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${alert.severity === 'critical' ? 'bg-red-200 text-red-800' :
                                                alert.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                                                    'bg-blue-200 text-blue-800'
                                            }`}>
                                            {alert.severity.toUpperCase()}
                                        </span>
                                        <span className="text-[10px] text-text-tertiary">
                                            {new Date(alert.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-medium text-text-primary mb-1">{alert.title}</h4>
                                    <p className="text-xs text-text-secondary">{alert.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, icon: Icon, trend, subValue, color }) => (
    <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-text-tertiary mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-text-primary font-display">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
            {trend === 'positive' && <ArrowUpRight className="w-4 h-4 text-green-500" />}
            {trend === 'negative' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
            <span className="text-xs text-text-secondary font-medium">{subValue}</span>
        </div>
    </div>
);

export default MonitoringDashboard;
