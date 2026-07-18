import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { services, therapists } from '../../data/bookingData';
import { Clock, User, CalendarDays } from 'lucide-react';

const ReceiptSidebar = ({ state, isMobile }) => {
  // Compute totals
  let totalCost = 0;
  let totalTime = 0;
  
  const serviceDef = state.service ? services[state.service] : null;
  const subOptionDef = serviceDef?.options.find(o => o.id === state.subOption);
  
  let selectedAddOns = [];
  if (subOptionDef) {
    totalCost += subOptionDef.price;
    totalTime += subOptionDef.duration;
    
    if (subOptionDef.addOns && state.addOns.length > 0) {
      selectedAddOns = subOptionDef.addOns.filter(a => state.addOns.includes(a.id));
      selectedAddOns.forEach(a => {
        totalCost += a.price;
        totalTime += a.duration;
      });
    }
  }

  const selectedTherapist = therapists.find(t => t.id === state.therapist);

  if (isMobile) {
    return (
      <div className="bg-white border-t border-nature-green/10 p-4 pb-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[10px] text-nature-green/60 font-sans uppercase tracking-wider">Total</span>
          <span className="text-2xl text-nature-green font-serif font-medium">${totalCost}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-nature-green/60 font-sans uppercase tracking-wider">Duration</span>
          <span className="text-lg text-nature-green font-sans flex items-center gap-1">
            <Clock className="w-4 h-4" /> {totalTime} min
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col p-10 bg-white/50 backdrop-blur-3xl sticky top-0">
      <h3 className="font-serif text-3xl text-nature-green mb-8">Your Sanctuary</h3>
      
      <div className="flex-1 flex flex-col gap-8 overflow-y-auto pr-2 no-scrollbar">
        {/* Service Summary */}
        <AnimatePresence>
          {serviceDef && subOptionDef && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2 pb-6 border-b border-nature-green/10"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-sans font-medium text-nature-green text-lg">{serviceDef.name}</h4>
                  <p className="text-sm text-nature-green/70">{subOptionDef.name}</p>
                </div>
                <span className="font-serif text-lg text-nature-green">${subOptionDef.price}</span>
              </div>
              
              {selectedAddOns.length > 0 && (
                <div className="flex flex-col gap-2 mt-4">
                  {selectedAddOns.map(addon => (
                    <div key={addon.id} className="flex justify-between items-center pl-4 border-l-2 border-lavender/30">
                      <span className="text-sm text-nature-green/80">+ {addon.name}</span>
                      <span className="text-sm text-nature-green/80">${addon.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Therapist Summary */}
        <AnimatePresence>
          {state.step > 1 && selectedTherapist && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 pb-6 border-b border-nature-green/10"
            >
              <div className="w-12 h-12 rounded-full bg-nature-green/5 flex items-center justify-center text-nature-green overflow-hidden">
                {selectedTherapist.avatar ? (
                  <img src={selectedTherapist.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-nature-green/60 uppercase tracking-wider text-[10px]">Therapist</span>
                <span className="text-nature-green font-medium font-sans">{selectedTherapist.name}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date/Time Summary */}
        <AnimatePresence>
          {state.step > 2 && state.date && state.time && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 pb-6 border-b border-nature-green/10"
            >
              <div className="w-12 h-12 rounded-full bg-nature-green/5 flex items-center justify-center text-nature-green">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-nature-green/60 uppercase tracking-wider text-[10px]">Date & Time</span>
                <span className="text-nature-green font-medium font-sans">
                  {new Date(state.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {state.time}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-8 mt-auto border-t border-nature-green/10 shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="font-sans text-nature-green/70">Total Duration</span>
          <span className="font-sans font-medium text-nature-green flex items-center gap-2">
            <Clock className="w-4 h-4 text-lavender" /> {totalTime} min
          </span>
        </div>
        <div className="flex justify-between items-end mt-4">
          <span className="font-sans text-lg text-nature-green">Total Cost</span>
          <motion.span 
            key={totalCost}
            initial={{ scale: 1.1, color: '#967BB6' }}
            animate={{ scale: 1, color: '#2D5A27' }}
            className="font-serif text-5xl text-nature-green font-medium"
          >
            ${totalCost}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default ReceiptSidebar;
