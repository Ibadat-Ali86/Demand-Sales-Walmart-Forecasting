import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PipelineStepIndicator = ({ currentStep, steps }) => {
    return (
        <div className="w-full py-8">
            <div className="relative flex items-center justify-between max-w-4xl mx-auto px-4">
                {/* Connecting Line Background */}
                <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full z-0" />

                {/* Animated Progress Line */}
                <motion.div
                    className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-blue-600 to-purple-600 -translate-y-1/2 rounded-full z-0"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isPending = index > currentStep;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            {/* Step Circle */}
                            <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${isCompleted ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-white shadow-lg' :
                                        isCurrent ? 'bg-white border-blue-500 shadow-xl shadow-blue-200' :
                                            'bg-white border-slate-200'
                                    }`}
                                initial={false}
                                animate={{
                                    scale: isCurrent ? 1.2 : 1,
                                    borderColor: isCurrent ? '#3b82f6' : isCompleted ? '#ffffff' : '#e2e8f0'
                                }}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5 text-white" />
                                ) : (
                                    <span className={`text-sm font-bold ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
                                        {index + 1}
                                    </span>
                                )}
                            </motion.div>

                            {/* Step Label */}
                            <div className="absolute top-14 w-32 text-center">
                                <span className={`text-sm font-medium transition-colors duration-300 ${isCurrent ? 'text-blue-700 font-bold' :
                                        isCompleted ? 'text-slate-700' : 'text-slate-400'
                                    }`}>
                                    {step.name}
                                </span>
                            </div>

                            {/* Pulse Effect for Current Step */}
                            {isCurrent && (
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-blue-400 opacity-20 -z-10"
                                    animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PipelineStepIndicator;
