import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const Step3DateTime = ({ state, updateState, onNext, onBack }) => {
  // Generate a week of dates
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  const timeSlots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];

  const isComplete = state.date && state.time;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-10"
    >
      <div>
        <h2 className="font-serif text-3xl text-nature-green mb-2">Select a Date</h2>
        <p className="text-nature-green/60 font-sans">When would you like to visit us?</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 snap-x no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
        {dates.map(dateObj => {
          const isSelected = state.date === dateObj.iso;
          return (
            <button
              key={dateObj.iso}
              onClick={() => updateState({ date: dateObj.iso, time: null })}
              className={`snap-center shrink-0 w-28 h-36 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                isSelected 
                  ? 'border-nature-green bg-nature-green text-white shadow-lg scale-105' 
                  : 'border-white bg-white text-nature-green hover:border-lavender/50 hover:bg-lavender/5 shadow-sm'
              }`}
            >
              <span className={`text-xs uppercase tracking-widest font-medium ${isSelected ? 'text-white/80' : 'text-nature-green/50'}`}>
                {dateObj.month}
              </span>
              <span className="font-serif text-4xl mt-1 mb-1">{dateObj.dayNum}</span>
              <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-nature-green'}`}>
                {dateObj.dayName}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div 
        animate={{ opacity: state.date ? 1 : 0.4, pointerEvents: state.date ? 'auto' : 'none' }}
        className="transition-opacity duration-300"
      >
        <h2 className="font-serif text-3xl text-nature-green mb-6">Available Times</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {timeSlots.map(time => {
            const isSelected = state.time === time;
            return (
              <button
                key={time}
                onClick={() => updateState({ time })}
                className={`p-4 rounded-xl border-2 font-sans font-medium text-lg transition-all duration-300 ${
                  isSelected 
                    ? 'border-nature-green bg-nature-green text-white shadow-md' 
                    : 'border-white bg-white text-nature-green hover:border-lavender/50 hover:bg-lavender/5 shadow-sm'
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="flex justify-between items-center pt-8 border-t border-nature-green/10 mt-8">
        <button 
          onClick={onBack}
          className="px-6 py-4 rounded-full font-sans text-nature-green hover:bg-nature-green/10 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button 
          disabled={!isComplete}
          onClick={onNext}
          className={`px-10 py-4 rounded-full font-sans text-lg font-medium transition-all ${
            isComplete 
              ? 'bg-nature-green text-white hover:bg-nature-greenLight shadow-lg hover:shadow-xl active:scale-95' 
              : 'bg-nature-green/20 text-white cursor-not-allowed'
          }`}
        >
          Review Details
        </button>
      </div>
    </motion.div>
  );
};

export default Step3DateTime;
