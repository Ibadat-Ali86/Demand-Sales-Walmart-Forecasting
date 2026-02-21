// API base URL
let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
if (baseUrl === '/') {
    baseUrl = '';
} else if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
}
export const API_BASE_URL = baseUrl;

// App routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    DATA_UPLOAD: '/data-upload',
    FORECAST_EXPLORER: '/forecast-explorer',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/:id',
    SCENARIO_SIMULATOR: '/scenario-simulator',
    REPORTS: '/reports',
};

// Chart colors
export const CHART_COLORS = {
    primary: '#0ea5e9',
    secondary: '#d946ef',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    actual: '#0ea5e9',
    predicted: '#d946ef',
    confidence: 'rgba(14, 165, 233, 0.1)',
};

// Model types
export const MODEL_TYPES = {
    XGBOOST: 'xgboost',
    LSTM: 'lstm',
    PROPHET: 'prophet',
    SARIMA: 'sarima',
    ENSEMBLE: 'ensemble',
};
