import React from 'react';
import { motion } from 'framer-motion';
import { therapists } from '../../data/bookingData';
import { Star, Check, ArrowLeft, User } from 'lucide-react';

const Step2Therapist = ({ state, updateState, onNext, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-10"
    >
      <div>
        <h2 className="font-serif text-3xl text-nature-green mb-2">Choose Your Therapist</h2>
        <p className="text-nature-green/60 font-sans">Select a specialist or choose the first available opening.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {therapists.map(therapist => {
          const isSelected = state.therapist === therapist.id;
          return (
            <button
              key={therapist.id}
              onClick={() => updateState({ therapist: therapist.id })}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 flex items-center gap-6 relative overflow-hidden ${
                isSelected 
                  ? 'border-nature-green bg-nature-green/5 shadow-md' 
                  : 'border-white bg-white hover:border-lavender/50 hover:bg-lavender/5 shadow-sm'
              }`}
            >
              {therapist.avatar ? (
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 shadow-inner">
                  <img src={therapist.avatar} alt={therapist.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-lavender/20 flex items-center justify-center shrink-0 text-lavender">
                  <User className="w-6 h-6" />
                </div>
              )}
              
              <div className="flex flex-col items-start flex-1 text-left">
                <span className="font-sans font-medium text-nature-green text-xl">{therapist.name}</span>
                <span className="text-nature-green/70 text-sm mb-2">{therapist.specialty}</span>
                {therapist.rating && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{therapist.rating}</span>
                  </div>
                )}
              </div>
              
              {isSelected && (
                <motion.div layoutId="therapist-check" className="absolute top-4 right-4 w-6 h-6 bg-nature-green rounded-full flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-nature-green/10 mt-8">
        <button 
          onClick={onBack}
          className="px-6 py-4 rounded-full font-sans text-nature-green hover:bg-nature-green/10 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button 
          onClick={onNext}
          className="px-10 py-4 rounded-full font-sans text-lg font-medium transition-all bg-nature-green text-white hover:bg-nature-greenLight shadow-lg hover:shadow-xl active:scale-95"
        >
          Select Date & Time
        </button>
      </div>
    </motion.div>
  );
};

export default Step2Therapist;
