import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, HelpCircle } from 'lucide-react';

const AlertModal = ({ isOpen, onClose, title, message, type = 'alert', onConfirm }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-nature-green/10 flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Decorative Blob */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-lavender/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="w-16 h-16 rounded-full bg-base-cream flex items-center justify-center text-lavender mb-6 z-10">
            {type === 'alert' ? (
              <AlertCircle className="w-8 h-8" />
            ) : (
              <HelpCircle className="w-8 h-8" />
            )}
          </div>
          
          <h2 className="font-serif text-2xl text-nature-green mb-3 z-10">{title}</h2>
          <p className="font-sans text-nature-green/70 mb-8 z-10">{message}</p>
          
          <div className="flex gap-4 w-full z-10">
            {type === 'confirm' && (
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-full font-medium transition-colors bg-base-cream text-nature-green hover:bg-nature-green/10"
              >
                Cancel
              </button>
            )}
            <button
              onClick={type === 'confirm' ? onConfirm : onClose}
              className={`flex-1 py-3 px-6 rounded-full font-medium transition-colors text-white shadow-lg ${
                type === 'confirm' 
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                  : 'bg-nature-green hover:bg-nature-greenLight shadow-nature-green/20'
              }`}
            >
              {type === 'confirm' ? 'Yes, I am sure' : 'Okay'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertModal;
