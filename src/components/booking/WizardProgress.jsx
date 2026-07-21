import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { num: 1, title: 'Spa' },
  { num: 2, title: 'Therapist' },
  { num: 3, title: 'Time' },
  { num: 4, title: 'Details' }
];

const WizardProgress = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between relative w-full px-2">
      {/* Background Line */}
      <div className="absolute top-5 left-0 w-full h-[2px] bg-nature-green/10 -z-10 rounded-full"></div>

      {/* Active Line (Animated) */}
      <motion.div
        className="absolute top-5 left-0 h-[2px] bg-nature-green -z-10 rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {steps.map((step) => {
        const isActive = step.num === currentStep;
        const isCompleted = step.num < currentStep;

        return (
          <div key={step.num} className="flex flex-col items-center gap-3 bg-base-cream px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg transition-all duration-500 ${isActive ? 'bg-nature-green text-white shadow-lg scale-110' :
                isCompleted ? 'bg-lavender text-white' : 'bg-white text-nature-green/40 border border-nature-green/10'
              }`}>
              {step.num}
            </div>
            <span className={`text-[10px] md:text-sm font-sans font-medium uppercase tracking-wider transition-colors duration-500 ${isActive ? 'text-nature-green' : isCompleted ? 'text-lavender' : 'text-nature-green/40'
              }`}>
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default WizardProgress;
