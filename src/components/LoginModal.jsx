import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [mode, setMode] = useState('login');
  
  const isPhoneValid = phone.length === 8 && (phone.startsWith('8') || phone.startsWith('9'));
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    setMode('login');
    setError('');
    onClose();
  };

  const handleNameChange = (e) => {
    const val = e.target.value.replace(/[^a-zA-Z]/g, '');
    setName(val);
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 8) {
      setPhone(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isPhoneValid) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    if (!name.trim()) {
      setError('Please fill in your first name');
      return;
    }

    setIsSubmitting(true);
    const result = await login(name, phone);
    setIsSubmitting(false);

    if (result.notFound) {
      setMode('not-found');
    } else if (result.success) {
      handleClose();
      navigate('/book');
    } else {
      setError(result.error || 'Failed to login. Please try again.');
    }
  };

  const handleRegister = async () => {
    setError('');
    setIsSubmitting(true);
    const result = await register(name, phone);
    setIsSubmitting(false);

    if (result.success) {
      handleClose();
      navigate('/book');
    } else {
      setError(result.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md p-8 bg-base-cream rounded-[2rem] shadow-2xl transition-all duration-300"
      >
        <button 
          onClick={handleClose}
          className="absolute p-2 transition-colors rounded-full top-4 right-4 hover:bg-black/5 text-black/50 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {mode === 'login' ? (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight font-heading text-forest-green">
                Welcome
              </h2>
          <p className="mt-2 text-sm text-forest-green/70 font-sans">
            Please enter your details to book an appointment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl">
              {error}
            </div>
          )}
          
          <div>
            <label className="block mb-2 text-sm font-medium text-forest-green font-sans">
              First Name
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender font-sans transition-all"
              placeholder="e.g. Jane"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-forest-green font-sans">
              Handphone Number (8 digits)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender font-sans transition-all"
              placeholder="e.g. 91234567"
              maxLength={8}
              required
            />
          </div>

          <div className="relative w-full pt-2">
            <AnimatePresence>
              {showTooltip && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max max-w-[280px] px-4 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-xl z-50 text-center pointer-events-none"
                >
                  Handphone number must be exactly 8 digits and start with 8 or 9.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-gray-900"></div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 text-white transition-all shadow-lg rounded-xl font-sans font-medium flex items-center justify-center gap-2 ${
                !isPhoneValid
                  ? 'bg-gray-400 cursor-not-allowed opacity-80'
                  : 'bg-lavender hover:bg-lavender-light hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Continue to Booking</span>
              )}
              </button>
            </div>
          </form>
          </>
        ) : (
          <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold tracking-tight font-heading text-forest-green mb-4">
              Account Not Found
            </h2>
            <p className="text-forest-green/80 font-sans mb-8 leading-relaxed">
              We couldn't find an existing account with the handphone number <strong className="text-forest-green">{phone}</strong>. Would you like to create a new account?
            </p>
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl mb-6">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRegister}
                disabled={isSubmitting}
                className="w-full py-4 text-white transition-all shadow-lg bg-nature-green hover:bg-nature-greenLight hover:scale-[1.02] active:scale-95 rounded-xl font-sans font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Now</span>
                )}
              </button>
              <button
                onClick={() => setMode('login')}
                disabled={isSubmitting}
                className="w-full py-4 text-forest-green transition-all bg-white border border-forest-green/20 hover:bg-forest-green/5 active:scale-95 rounded-xl font-sans font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
