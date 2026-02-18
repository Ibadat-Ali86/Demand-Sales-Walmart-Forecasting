import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ currentStep, steps }) => {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > index + 1;
                    const isCurrent = currentStep === index + 1;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={index} className="flex items-center w-full max-w-xs last:w-auto">
                            <div className="relative flex flex-col items-center">
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 z-10
                                        ${isCompleted
                                            ? 'bg-brand-600 border-brand-600 text-white'
                                            : isCurrent
                                                ? 'bg-bg-primary border-brand-600 text-brand-600 shadow-lg shadow-brand-500/20'
                                                : 'bg-bg-secondary border-border-primary text-text-tertiary'}
                                    `}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                                </div>
                                <span
                                    className={`
                                        absolute top-12 text-xs font-semibold whitespace-nowrap transition-colors duration-300
                                        ${isCurrent ? 'text-brand-600' : isCompleted ? 'text-text-primary' : 'text-text-tertiary'}
                                    `}
                                >
                                    {step}
                                </span>
                            </div>

                            {!isLast && (
                                <div className="flex-1 h-0.5 mx-4 bg-gray-200 relative w-full min-w-[3rem]">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-brand-600 transition-all duration-500"
                                        style={{ width: isCompleted ? '100%' : '0%' }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;
