import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Step4Checkout = ({ state, updateState, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    updateState({ user: { ...state.user, [e.target.name]: e.target.value } });
  };

  const isComplete = state.user.name.length > 2 && state.user.email.includes('@') && state.user.phone.length > 5;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isComplete) return;
    setIsSubmitting(true);
    
    // Simulate an API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center py-20 gap-6"
      >
        <div className="w-24 h-24 rounded-full bg-nature-green/10 flex items-center justify-center text-nature-green mb-4">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="font-serif text-5xl text-nature-green">Sanctuary Reserved</h2>
        <p className="text-nature-green/70 font-sans max-w-md mx-auto text-lg leading-relaxed">
          Thank you, {state.user.name.split(' ')[0]}. We have sent a confirmation email to <span className="font-medium text-nature-green">{state.user.email}</span> with your appointment details.
        </p>
        <Link 
          to="/"
          className="mt-8 px-10 py-4 rounded-full font-sans text-lg font-medium transition-all bg-lavender text-white hover:bg-lavender/90 shadow-lg active:scale-95"
        >
          Return to Sanctuary
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-10"
    >
      <div>
        <h2 className="font-serif text-3xl text-nature-green mb-2">Final Details</h2>
        <p className="text-nature-green/60 font-sans">Who will we be pampering today?</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-nature-green/80 uppercase tracking-wider pl-2">Full Name</label>
          <input 
            type="text" 
            name="name"
            value={state.user.name}
            onChange={handleInputChange}
            placeholder="E.g. Jane Doe"
            className="p-4 rounded-2xl border-2 border-white bg-white focus:outline-none focus:border-lavender/50 transition-colors shadow-sm text-nature-green font-medium font-sans text-lg"
            required
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-nature-green/80 uppercase tracking-wider pl-2">Email Address</label>
          <input 
            type="email" 
            name="email"
            value={state.user.email}
            onChange={handleInputChange}
            placeholder="jane@example.com"
            className="p-4 rounded-2xl border-2 border-white bg-white focus:outline-none focus:border-lavender/50 transition-colors shadow-sm text-nature-green font-medium font-sans text-lg"
            required
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-nature-green/80 uppercase tracking-wider pl-2">Phone Number</label>
          <input 
            type="tel" 
            name="phone"
            value={state.user.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 000-0000"
            className="p-4 rounded-2xl border-2 border-white bg-white focus:outline-none focus:border-lavender/50 transition-colors shadow-sm text-nature-green font-medium font-sans text-lg"
            required
          />
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-nature-green/10 mt-8">
          <button 
            type="button"
            onClick={onBack}
            className="px-6 py-4 rounded-full font-sans text-nature-green hover:bg-nature-green/10 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button 
            type="submit"
            disabled={!isComplete || isSubmitting}
            className={`px-10 py-4 rounded-full font-sans text-lg font-medium transition-all flex items-center gap-3 ${
              isComplete && !isSubmitting
                ? 'bg-nature-green text-white hover:bg-nature-greenLight shadow-lg hover:shadow-xl active:scale-95' 
                : 'bg-nature-green/20 text-white cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Step4Checkout;
