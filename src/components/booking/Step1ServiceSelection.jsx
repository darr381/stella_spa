import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '../../data/bookingData';
import { Check, Clock, DollarSign } from 'lucide-react';

const Step1ServiceSelection = ({ state, updateState, onNext }) => {

  const handleServiceSelect = (serviceId) => {
    if (state.service !== serviceId) {
      updateState({ service: serviceId, addOns: [] });
    }
  };

  const toggleAddOn = (addOnId) => {
    const current = state.addOns || [];
    if (current.includes(addOnId)) {
      updateState({ addOns: current.filter(id => id !== addOnId) });
    } else {
      updateState({ addOns: [...current, addOnId] });
    }
  };

  const isComplete = !!state.service;
  const currentServiceDef = state.service ? services[state.service] : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-10"
    >
      <div>
        <h2 className="font-serif text-3xl text-nature-green mb-6">Select Your Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(services).map(svc => (
            <button
              key={svc.id}
              onClick={() => handleServiceSelect(svc.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden flex flex-col gap-2 ${state.service === svc.id
                  ? 'border-nature-green bg-nature-green/5 shadow-md scale-[1.02]'
                  : 'border-white bg-white hover:border-lavender/50 hover:bg-lavender/5 shadow-sm'
                }`}
            >
              <span className={`block font-sans font-semibold text-lg ${state.service === svc.id ? 'text-nature-green' : 'text-nature-green/70'}`}>
                {svc.name}
              </span>
              <div className="flex gap-4 text-sm font-medium opacity-70">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {svc.duration} min</span>
                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {svc.price}</span>
              </div>
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
            className="flex flex-col gap-8"
          >
            {/* Package Details */}
            <div className="bg-white p-8 rounded-3xl border border-nature-green/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-nature-green/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                <div>
                  <h3 className="font-serif text-3xl text-nature-green">{currentServiceDef.name}</h3>
                  <div className="flex gap-4 mt-2 font-sans text-nature-green/70 font-medium">
                    <span className="bg-lavender/10 text-lavender px-3 py-1 rounded-full text-sm">
                      {currentServiceDef.duration} Minutes
                    </span>
                    <span className="bg-nature-green/10 text-nature-green px-3 py-1 rounded-full text-sm">
                      ${currentServiceDef.price}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <h4 className="font-sans font-semibold uppercase tracking-widest text-nature-green/50 text-xs mb-4">
                  Included in this package ({currentServiceDef.included.length} steps)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  {currentServiceDef.included.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-lavender mt-2 shrink-0"></div>
                      <span className="font-sans text-nature-green/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add-Ons Section */}
            {currentServiceDef.addOns && currentServiceDef.addOns.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl text-nature-green mb-6">Optional Add-Ons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentServiceDef.addOns.map(addon => {
                    const isSelected = (state.addOns || []).includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 flex justify-between items-center ${isSelected ? 'border-lavender bg-lavender/10 shadow-sm' : 'border-white bg-white hover:border-lavender/30 shadow-sm'
                          }`}
                      >
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'border-lavender bg-lavender text-white' : 'border-nature-green/30'
                              }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            <span className="font-sans font-medium text-nature-green text-left leading-tight">{addon.name}</span>
                          </div>
                        </div>
                        <span className="font-serif text-lg text-lavender ml-4 shrink-0">+${addon.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
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
