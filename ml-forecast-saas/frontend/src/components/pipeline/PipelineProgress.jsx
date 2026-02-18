import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, Loader2, Sparkles,
    Database, Brain, LineChart, FileSearch,
    Settings, Zap, ChevronRight
} from 'lucide-react';
import Button from '../ui/Button';

const STAGES = [
    {
        id: 'upload',
        label: 'Data Upload',
        icon: FileSearch,
        description: 'Securely transferring your data',
        estimatedTime: '2-5 seconds',
        tips: [
            "Your data is encrypted during transfer",
            "We never store your raw data longer than necessary",
            "Large files may take longer to process"
        ]
    },
    {
        id: 'validation',
        label: 'Validation',
        icon: CheckCircle2,
        description: 'Checking data quality and format',
        estimatedTime: '3-8 seconds',
        tips: [
            "We're checking for missing values and outliers",
            "Date formats are automatically detected",
            "Data quality score is calculated at this stage"
        ]
    },
    {
        id: 'profiling',
        label: 'Data Profiling',
        icon: Database,
        description: 'Analyzing patterns and statistics',
        estimatedTime: '5-10 seconds',
        tips: [
            "Statistical summaries are generated",
            "Seasonality patterns are detected",
            "Data distribution is analyzed"
        ]
    },
    {
        id: 'preprocessing',
        label: 'Preprocessing',
        icon: Settings,
        description: 'Cleaning and transforming data',
        estimatedTime: '8-15 seconds',
        tips: [
            "Missing values are intelligently imputed",
            "Categorical variables are encoded",
            "Features are scaled for optimal model performance"
        ]
    },
    {
        id: 'training',
        label: 'Model Training',
        icon: Brain,
        description: 'Training Prophet, XGBoost & SARIMA',
        estimatedTime: '20-45 seconds',
        tips: [
            "Prophet captures seasonality and trends",
            "XGBoost learns complex feature interactions",
            "SARIMA models time-series autocorrelation",
            "Ensemble combines all predictions for best accuracy"
        ]
    },
    {
        id: 'ensemble',
        label: 'Ensemble & Results',
        icon: LineChart,
        description: 'Generating final forecast',
        estimatedTime: '5-10 seconds',
        tips: [
            "Weighted ensemble optimizes predictions",
            "Confidence intervals are calculated",
            "Business insights are generated"
        ]
    }
];

const PipelineProgress = ({ currentStage = 'upload', stageProgress = 0, onComplete }) => {
    const [currentTip, setCurrentTip] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Rotate tips every 8 seconds
        const tipTimer = setInterval(() => {
            const stage = STAGES.find(s => s.id === currentStage);
            if (stage && stage.tips.length > 0) {
                setCurrentTip(prev => (prev + 1) % stage.tips.length);
            }
        }, 8000);
        return () => clearInterval(tipTimer);
    }, [currentStage]);

    const currentStageIndex = STAGES.findIndex(s => s.id === currentStage);
    const isComplete = currentStage === 'completed';

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full border border-brand-200 mb-4"
                >
                    <Sparkles className="w-4 h-4 text-brand-600" />
                    <span className="text-sm text-brand-700 font-medium">AI-Powered Analysis</span>
                </motion.div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                    {isComplete ? 'Analysis Complete!' : 'Processing Your Data'}
                </h2>
                <p className="text-text-secondary">
                    {isComplete
                        ? 'Your forecast is ready'
                        : `Elapsed time: ${formatTime(elapsedTime)}`
                    }
                </p>
            </div>

            {/* Progress Steps */}
            <div className="relative">
                {/* Progress line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border-primary">
                    <motion.div
                        className="absolute top-0 left-0 w-full bg-gradient-to-b from-brand-500 to-purple-500"
                        initial={{ height: '0%' }}
                        animate={{
                            height: isComplete
                                ? '100%'
                                : `${((currentStageIndex + (stageProgress / 100)) / (STAGES.length - 1)) * 100}%`
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* Steps */}
                <div className="space-y-4">
                    {STAGES.map((stage, index) => {
                        const isActive = index === currentStageIndex;
                        const isPast = index < currentStageIndex;
                        const isFuture = index > currentStageIndex;
                        const Icon = stage.icon;

                        return (
                            <motion.div
                                key={stage.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`
                  relative flex items-start gap-4 p-4 rounded-xl transition-all duration-300
                  ${isActive ? 'bg-bg-secondary border border-brand-300' : ''}
                  ${isPast ? 'opacity-60' : ''}
                `}
                            >
                                {/* Icon */}
                                <div className={`
                  relative z-10 w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0
                  ${isActive ? 'bg-brand-100 border-2 border-brand-500' : ''}
                  ${isPast ? 'bg-success-100 border-2 border-success-500' : ''}
                  ${isFuture ? 'bg-bg-secondary border-2 border-border-primary' : ''}
                `}>
                                    {isActive ? (
                                        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
                                    ) : isPast ? (
                                        <CheckCircle2 className="w-8 h-8 text-success-600" />
                                    ) : (
                                        <Icon className="w-8 h-8 text-text-tertiary" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`
                      font-semibold
                      ${isActive ? 'text-text-primary' : ''}
                      ${isPast ? 'text-text-secondary' : ''}
                      ${isFuture ? 'text-text-tertiary' : ''}
                    `}>
                                            {stage.label}
                                        </h3>
                                        {isActive && (
                                            <span className="text-xs text-brand-600 font-medium">
                                                {stageProgress}%
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-text-secondary mb-2">
                                        {stage.description}
                                    </p>

                                    {/* Active stage details */}
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="space-y-3"
                                        >
                                            {/* Progress bar */}
                                            <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-brand-500 to-purple-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${stageProgress}%` }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>

                                            {/* Educational tip */}
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={currentTip}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-start gap-2 p-3 bg-brand-50 rounded-lg border border-brand-200"
                                                >
                                                    <Zap className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-brand-700">
                                                        {stage.tips[currentTip]}
                                                    </p>
                                                </motion.div>
                                            </AnimatePresence>

                                            <p className="text-xs text-text-tertiary">
                                                Estimated time: {stage.estimatedTime}
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* Completion indicator */}
                                    {isPast && (
                                        <span className="inline-flex items-center gap-1 text-xs text-success-600">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Completed
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Completion celebration */}
            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 text-center"
                    >
                        <Button
                            onClick={onComplete}
                            variant="primary"
                            size="lg"
                            className="min-w-[200px]"
                        >
                            View Results
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PipelineProgress;
