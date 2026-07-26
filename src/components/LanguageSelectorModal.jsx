import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelectorModal = () => {
  const { language, changeLanguage } = useLanguage();

  if (language !== null) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm p-8 bg-base-cream rounded-[2rem] shadow-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight font-heading text-forest-green mb-8">
            Select Language <br /> 选择语言
          </h2>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => changeLanguage('en')}
              className="w-full py-4 text-white transition-all shadow-lg bg-nature-green hover:bg-nature-greenLight hover:scale-[1.02] active:scale-95 rounded-xl font-sans font-medium text-lg"
            >
              English
            </button>
            <button 
              onClick={() => changeLanguage('zh')}
              className="w-full py-4 text-white transition-all shadow-lg bg-nature-green hover:bg-nature-greenLight hover:scale-[1.02] active:scale-95 rounded-xl font-sans font-medium text-lg"
            >
              中文 (Simplified Chinese)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LanguageSelectorModal;
