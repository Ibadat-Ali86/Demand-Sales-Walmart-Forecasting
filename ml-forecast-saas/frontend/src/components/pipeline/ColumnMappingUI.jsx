/**
 * Phase 2: Column Mapping Interface
 * Interactive drag-drop UI for mapping user columns to required schema
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Calendar,
    TrendingUp,
    HelpCircle,
    Sparkles,
    RefreshCw
} from 'lucide-react';

const REQUIRED_COLUMNS = [
    {
        id: 'date',
        label: 'Date Column',
        description: 'Timeline for your forecast',
        icon: Calendar,
        examples: ['date', 'timestamp', 'order_date', 'datetime']
    },
    {
        id: 'target',
        label: 'Target Column',
        description: 'Value to predict (e.g., sales, demand)',
        icon: TrendingUp,
        examples: ['sales', 'revenue', 'quantity', 'demand', 'value']
    }
];

export default function ColumnMappingUI({ detectedColumns, onMappingComplete }) {
    const [mappings, setMappings] = useState({});
    const [draggedColumn, setDraggedColumn] = useState(null);

    // Pre-fill with auto-detected mappings if available
    React.useEffect(() => {
        if (detectedColumns && Object.keys(mappings).length === 0) {
            const autoMappings = {};

            REQUIRED_COLUMNS.forEach(req => {
                const detected = detectedColumns[req.id];
                if (detected && detected[0]) {
                    autoMappings[req.id] = detected[0]; // First match
                }
            });

            setMappings(autoMappings);
        }
    }, [detectedColumns]);

    const handleDragStart = (e, columnName) => {
        setDraggedColumn(columnName);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetId) => {
        e.preventDefault();

        if (draggedColumn) {
            setMappings(prev => ({
                ...prev,
                [targetId]: draggedColumn
            }));
        }

        setDraggedColumn(null);
    };

    const handleSelect = (targetId, columnName) => {
        setMappings(prev => ({
            ...prev,
            [targetId]: columnName
        }));
    };

    const handleRemove = (targetId) => {
        setMappings(prev => {
            const newMappings = { ...prev };
            delete newMappings[targetId];
            return newMappings;
        });
    };

    const handleAutoDetect = () => {
        // Trigger auto-detection (this would call backend adapter)
        const autoMappings = {};

        REQUIRED_COLUMNS.forEach(req => {
            const detected = detectedColumns?.[req.id];
            if (detected && detected[0]) {
                autoMappings[req.id] = detected[0];
            }
        });

        setMappings(autoMappings);
    };

    const isComplete = REQUIRED_COLUMNS.every(col => mappings[col.id]);
    const availableColumns = Object.keys(detectedColumns || {});
    const mappedColumns = Object.values(mappings);
    const unmappedColumns = availableColumns.filter(col => !mappedColumns.includes(col));

    const handleContinue = () => {
        if (isComplete && onMappingComplete) {
            onMappingComplete(mappings);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <Sparkles className="w-7 h-7 text-purple-500" />
                            Map Your Columns
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Connect your data columns to our forecast schema
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAutoDetect}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Auto-Detect
                    </motion.button>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(Object.keys(mappings).length / REQUIRED_COLUMNS.length) * 100}%` }}
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        />
                    </div>
                    <span className="text-sm font-medium text-gray-600 min-w-[60px]">
                        {Object.keys(mappings).length} / {REQUIRED_COLUMNS.length}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Required Columns (Drop Zones) */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Required Mappings
                    </h3>

                    <div className="space-y-4">
                        {REQUIRED_COLUMNS.map((req) => {
                            const Icon = req.icon;
                            const mapped = mappings[req.id];
                            const confidence = detectedColumns?.[req.id]?.[1] || 0;

                            return (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`
                    relative p-4 rounded-xl border-2 border-dashed transition-all
                    ${mapped
                                            ? 'border-green-400 bg-green-50'
                                            : 'border-gray-300 bg-white hover:border-purple-300'
                                        }
                  `}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, req.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${mapped ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}
                    `}>
                                            <Icon className="w-5 h-5" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-gray-800">{req.label}</h4>
                                                {mapped && (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                )}
                                            </div>

                                            <p className="text-sm text-gray-600 mb-2">{req.description}</p>

                                            {!mapped ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {req.examples.map(ex => (
                                                        <span key={ex} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                                            {ex}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-3 py-1 bg-white rounded-lg font-medium text-green-700 text-sm border border-green-200">
                                                            {mapped}
                                                        </span>
                                                        {confidence > 0.7 && (
                                                            <span className="text-xs text-green-600">
                                                                {Math.round(confidence * 100)}% confident
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemove(req.id)}
                                                        className="text-sm text-red-600 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Available Columns (Draggable) */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-blue-500" />
                        Your Columns
                    </h3>

                    {unmappedColumns.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {unmappedColumns.map((col) => (
                                <motion.div
                                    key={col}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, col)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-3 bg-white border-2 border-gray-200 rounded-lg cursor-move hover:border-purple-300 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-700">{col}</span>
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <p className="text-gray-600">All columns mapped!</p>
                        </div>
                    )}

                    {/* Dropdown fallback for mobile */}
                    <div className="mt-6 lg:hidden">
                        <p className="text-sm text-gray-600 mb-3">Or select from dropdown:</p>
                        {REQUIRED_COLUMNS.map((req) => (
                            <div key={req.id} className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {req.label}
                                </label>
                                <select
                                    value={mappings[req.id] || ''}
                                    onChange={(e) => handleSelect(req.id, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Select column...</option>
                                    {availableColumns.map(col => (
                                        <option key={col} value={col}>{col}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 flex justify-end">
                <motion.button
                    whileHover={{ scale: isComplete ? 1.02 : 1 }}
                    whileTap={{ scale: isComplete ? 0.98 : 1 }}
                    onClick={handleContinue}
                    disabled={!isComplete}
                    className={`
            px-8 py-3 rounded-xl font-semibold text-white flex items-center gap-2 shadow-lg transition-all
            ${isComplete
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl cursor-pointer'
                            : 'bg-gray-300 cursor-not-allowed'
                        }
          `}
                >
                    {isComplete ? (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Continue to Analysis
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-5 h-5" />
                            Map Required Columns
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
