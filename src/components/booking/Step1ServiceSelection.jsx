import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '../../data/bookingData';
import { Check } from 'lucide-react';

const Step1ServiceSelection = ({ state, updateState, onNext }) => {

  const handleServiceSelect = (serviceId) => {
    if (state.service !== serviceId) {
      updateState({ service: serviceId, subOption: null, addOns: [] });
    }
  };

  const handleSubOptionSelect = (optionId) => {
    updateState({ subOption: optionId, addOns: [] });
  };

  const toggleAddOn = (addOnId) => {
    const current = state.addOns;
    if (current.includes(addOnId)) {
      updateState({ addOns: current.filter(id => id !== addOnId) });
    } else {
      updateState({ addOns: [...current, addOnId] });
    }
  };

  const isComplete = state.service && state.subOption;
  const currentServiceDef = state.service ? services[state.service] : null;
  const currentOptionDef = currentServiceDef?.options.find(o => o.id === state.subOption);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-10"
    >
      <div>
        <h2 className="font-serif text-3xl text-nature-green mb-6">Select Your SPA</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(services).map(svc => (
            <button
              key={svc.id}
              onClick={() => handleServiceSelect(svc.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${state.service === svc.id
                  ? 'border-nature-green bg-nature-green/5 shadow-md'
                  : 'border-white bg-white hover:border-lavender/50 hover:bg-lavender/5 shadow-sm'
                }`}
            >
              <span className={`block font-sans font-medium text-lg ${state.service === svc.id ? 'text-nature-green' : 'text-nature-green/70'}`}>
                {svc.name}
              </span>
              {state.service === svc.id && (
                <motion.div layoutId="service-check" className="absolute top-4 right-4 w-6 h-6 bg-nature-green rounded-full flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {state.service && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="font-serif text-2xl text-nature-green mb-6">Choose Duration / Type</h3>
            <div className="flex flex-col gap-4">
              {currentServiceDef.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleSubOptionSelect(opt.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 flex justify-between items-center ${state.subOption === opt.id
                      ? 'border-nature-green bg-nature-green/5'
                      : 'border-white bg-white hover:border-lavender/30 shadow-sm'
                    }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-sans font-medium text-nature-green text-lg">{opt.name}</span>
                    <span className="text-nature-green/60 text-sm font-sans">{opt.duration} min</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-serif text-2xl text-nature-green">${opt.price}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${state.subOption === opt.id ? 'border-nature-green bg-nature-green text-white' : 'border-nature-green/20'
                      }`}>
                      {state.subOption === opt.id && <Check className="w-4 h-4" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {currentOptionDef?.addOns && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4"
          >
            <h3 className="font-serif text-2xl text-nature-green mb-6">Enhance Your Treatment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentOptionDef.addOns.map(addon => {
                const isSelected = state.addOns.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 flex justify-between items-center ${isSelected ? 'border-lavender bg-lavender/10 shadow-sm' : 'border-white bg-white hover:border-lavender/30 shadow-sm'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-lavender bg-lavender text-white' : 'border-nature-green/30'
                        }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span className="font-sans font-medium text-nature-green">{addon.name}</span>
                    </div>
                    <span className="font-serif text-lg text-lavender">+${addon.price}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end pt-8">
        <button
          disabled={!isComplete}
          onClick={onNext}
          className={`px-10 py-4 rounded-full font-sans text-lg font-medium transition-all ${isComplete
              ? 'bg-nature-green text-white hover:bg-nature-greenLight shadow-lg hover:shadow-xl active:scale-95'
              : 'bg-nature-green/20 text-white cursor-not-allowed'
            }`}
        >
          Continue to Therapist
        </button>
      </div>
    </motion.div>
  );
};

export default Step1ServiceSelection;
