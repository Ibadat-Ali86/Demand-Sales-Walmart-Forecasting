import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Upload,
    FileSearch,
    Settings,
    Brain,
    BarChart3,
    Target,
    TrendingUp,
    CheckCircle,
    RefreshCw,
} from 'lucide-react';
import { useFlow } from '../context/FlowContext';

// Import analysis components
import ProfessionalDatasetProfiler from '../components/analysis/ProfessionalDatasetProfiler';
import PipelineStepIndicator from '../components/common/StepIndicator'; // Updated import
import PreprocessingLog from '../components/analysis/PreprocessingLog';
import ModelTrainingProgress from '../components/analysis/ModelTrainingProgress';
import BusinessInsights from '../components/analysis/BusinessInsights';
import ActionableRecommendations from '../components/analysis/ActionableRecommendations';
import ForecastVisualizationSuite from '../components/charts/ForecastVisualizationSuite';
import ColumnMappingModal from '../components/common/ColumnMappingModal';
import SanityCheck from '../components/analysis/SanityCheck';
import Confetti from '../components/common/Confetti';
import { API_BASE_URL } from '../utils/constants';

// Core Components
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import FileUploadZone from '../components/upload/FileUploadZone'; // New Component

// Simple Error Boundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-800">
                    <h2 className="text-xl font-bold mb-2">Component Error</h2>
                    <p className="font-mono text-sm">{this.state.error?.toString()}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const AnalysisDashboard = () => {
    const navigate = useNavigate();
    const { uploadedData: flowUploadedData, completeStep } = useFlow();

    // State
    const [currentStep, setCurrentStep] = useState(flowUploadedData ? 2 : 1); // 1-indexed for StepIndicator
    const [uploadedData, setUploadedData] = useState(flowUploadedData?.allData || flowUploadedData?.rawData || null);
    const [profile, setProfile] = useState(null);
    const [preprocessedData, setPreprocessedData] = useState(null);
    const [modelMetrics, setModelMetrics] = useState(null);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [activeTab, setActiveTab] = useState('insights');
    const [analysisData, setAnalysisData] = useState(null);
    const [sessionId, setSessionId] = useState(flowUploadedData?.sessionId || null);
    const sessionIdRef = useRef(null);

    // Mapping Modal
    const [showMappingModal, setShowMappingModal] = useState(false);
    const [pendingFile, setPendingFile] = useState(null);
    const [csvColumns, setCsvColumns] = useState([]);
    const [columnMapping, setColumnMapping] = useState({ date: 'Date', target: 'Sales' });

    useEffect(() => {
        sessionIdRef.current = sessionId;
    }, [sessionId]);

    const steps = ['Upload Data', 'Profile Dataset', 'Preprocess', 'Train Model', 'View Results'];

    // ... (Keep existing repairSession logic if needed, usually FlowContext handles it)
    // For brevity, assuming flowUploadedData passes correct session or we re-upload in DataUpload page.

    const handleFileUpload = async (file) => {
        try {
            const text = await file.text();
            const lines = text.trim().split('\n');
            if (lines.length > 0) {
                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                setCsvColumns(headers);
                setPendingFile(file);
                setShowMappingModal(true);
            }
        } catch (error) {
            console.error("Error reading file:", error);
            alert("Failed to read file headers.");
        }
    };

    const handleMappingConfirm = async (mapping) => {
        if (!pendingFile) return;
        setColumnMapping(mapping);

        const formData = new FormData();
        formData.append('file', pendingFile);

        try {
            const response = await fetch(`${API_BASE_URL}/api/analysis/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');
            const result = await response.json();

            setSessionId(result.session_id);
            setUploadedData(result.sample_data);
            completeStep('upload', {
                sessionId: result.session_id,
                rawData: result.sample_data,
                fileName: pendingFile.name
            });

            // Trigger profiling
            try {
                const profileRes = await fetch(`${API_BASE_URL}/api/analysis/profile/${result.session_id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        target_col: mapping.target,
                        date_col: mapping.date || 'Date'
                    })
                });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile(profileData);
                }
            } catch (pError) {
                console.warn("Auto-profile failed:", pError);
            }

            setCurrentStep(2); // Move to Profile step
        } catch (error) {
            console.error("Upload error:", error);
            alert(`Upload failed: ${error.message}`);
        }
    };

    const handleProfileComplete = () => {
        setCurrentStep(3); // Preprocess
    };

    const handlePreprocessingComplete = (processedData, log) => {
        setPreprocessedData({ data: processedData, log });
        setCurrentStep(4); // Train
    };

    const handleTrainingComplete = (metrics) => {
        setModelMetrics(metrics);
        setAnalysisData(metrics);
        completeStep('analysis', metrics);
        setAnalysisComplete(true);
        setShowConfetti(true);
        setCurrentStep(5); // Results
    };

    const resetPipeline = () => {
        setCurrentStep(1);
        setUploadedData(null);
        setProfile(null);
        setPreprocessedData(null);
        setModelMetrics(null);
        setAnalysisComplete(false);
        setSessionId(null);
        navigate('/analysis', { replace: true });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Confetti trigger={showConfetti} />

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Analysis Pipeline</h2>
                    <p className="text-text-secondary mt-1">End-to-end forecasting workflow.</p>
                </div>
                {analysisComplete && (
                    <Button onClick={resetPipeline} variant="secondary" icon={RefreshCw}>
                        New Analysis
                    </Button>
                )}
            </div>

            <PipelineStepIndicator currentStep={currentStep} steps={steps} />

            <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {/* Step 1: Upload (re-using simplistic upload if arriving directly here) */}
                    {currentStep === 1 && (
                        <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <Card className="max-w-2xl mx-auto p-8 text-center">
                                <h3 className="text-xl font-bold mb-4">Start Analysis</h3>
                                <p className="text-text-secondary mb-6">Upload your dataset to begin processing.</p>
                                <FileUploadZone onFileSelect={handleFileUpload} />
                            </Card>
                            <ColumnMappingModal
                                isOpen={showMappingModal}
                                onClose={() => setShowMappingModal(false)}
                                columns={csvColumns}
                                onConfirm={handleMappingConfirm}
                                fileInfo={pendingFile}
                            />
                        </motion.div>
                    )}

                    {/* Step 2: Profile */}
                    {currentStep === 2 && (
                        <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <ProfessionalDatasetProfiler
                                data={uploadedData}
                                onProfileComplete={handleProfileComplete}
                                externalProfile={profile}
                            />
                        </motion.div>
                    )}

                    {/* Step 3: Preprocess */}
                    {currentStep === 3 && (
                        <motion.div key="preprocess" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <PreprocessingLog
                                data={uploadedData}
                                onPreprocessingComplete={handlePreprocessingComplete}
                                sessionId={sessionId}
                            />
                        </motion.div>
                    )}

                    {/* Step 4: Train */}
                    {currentStep === 4 && (
                        <motion.div key="training" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <ModelTrainingProgress
                                data={uploadedData}
                                onTrainingComplete={handleTrainingComplete}
                                sessionId={sessionId}
                            />
                        </motion.div>
                    )}

                    {/* Step 5: Results */}
                    {currentStep === 5 && (
                        <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            {/* Tabs */}
                            <div className="flex gap-2 mb-6 border-b border-border-default overflow-x-auto">
                                {[
                                    { id: 'insights', label: 'Insights', icon: TrendingUp },
                                    { id: 'charts', label: 'Visualizations', icon: BarChart3 },
                                    { id: 'sanity', label: 'Sanity Check', icon: CheckCircle },
                                    { id: 'actions', label: 'Action Plan', icon: Target },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap
                                            ${activeTab === tab.id
                                                ? 'border-brand-600 text-brand-600'
                                                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-primary'}
                                        `}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <ErrorBoundary>
                                {activeTab === 'insights' && (
                                    <BusinessInsights forecastData={uploadedData} metrics={modelMetrics} onContinue={() => setActiveTab('charts')} />
                                )}
                                {activeTab === 'charts' && (
                                    <ForecastVisualizationSuite forecastData={analysisData} historicalData={uploadedData} />
                                )}
                                {activeTab === 'sanity' && (
                                    <SanityCheck forecastData={analysisData} historicalData={uploadedData} />
                                )}
                                {activeTab === 'actions' && (
                                    <ActionableRecommendations forecastData={analysisData} insights={modelMetrics} />
                                )}
                            </ErrorBoundary>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AnalysisDashboard;
