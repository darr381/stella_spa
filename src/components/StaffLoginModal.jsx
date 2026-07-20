import React, { useState } from 'react';
import { X, Loader2, KeyRound, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const StaffLoginModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    setError('');
    setPhone('');
    setPassword('');
    setName('');
    setMode('login');
    onClose();
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
    setPhone(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!phone || !password || (mode === 'register' && !name)) {
        throw new Error('Please fill in all fields.');
      }
      
      const isPhoneValid = phone.length === 8 && (phone.startsWith('8') || phone.startsWith('9'));
      if (!isPhoneValid) {
        throw new Error('Handphone number must be 8 digits and start with 8 or 9.');
      }

      const employeeRef = doc(db, 'employees', phone);
      const docSnap = await getDoc(employeeRef);

      if (mode === 'login') {
        if (docSnap.exists()) {
          const employeeData = docSnap.data();
          if (employeeData.password === password) {
            const sessionData = { id: phone, ...employeeData };
            localStorage.setItem('naturaSpaStaff', JSON.stringify(sessionData));
            handleClose();
            navigate('/staff/dashboard');
          } else {
            throw new Error('Incorrect password.');
          }
        } else {
          throw new Error('Staff member not found.');
        }
      } else {
        // Register Mode
        if (docSnap.exists()) {
          throw new Error('An employee with this handphone number already exists.');
        }
        
        const newEmployee = {
          displayName: name,
          password: password,
          role: "therapist",
          onLeave: false,
          workingHours: {
            start: "10:00",
            end: "22:00"
          },
          lunchBreak: {
            start: "12:00",
            end: "13:00"
          },
          createdAt: new Date().toISOString() // Better serialization
        };
        
        await setDoc(employeeRef, newEmployee);
        
        const sessionData = { id: phone, ...newEmployee };
        localStorage.setItem('naturaSpaStaff', JSON.stringify(sessionData));
        handleClose();
        navigate('/staff/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-8 bg-base-cream rounded-[2rem] shadow-2xl transition-all duration-300">
        <button 
          onClick={handleClose}
          className="absolute p-2 transition-colors rounded-full top-4 right-4 hover:bg-black/5 text-black/50 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4 text-nature-green">
            {mode === 'login' ? <KeyRound className="w-10 h-10 opacity-80" /> : <UserPlus className="w-10 h-10 opacity-80" />}
          </div>
          <h2 className="text-3xl font-bold tracking-tight font-heading text-forest-green">
            {mode === 'login' ? 'Staff Portal' : 'Create Employee'}
          </h2>
          <p className="mt-2 text-sm text-forest-green/70 font-sans">
            {mode === 'login' ? 'Please enter your employee credentials.' : 'Register a new employee profile.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl">
              {error}
            </div>
          )}
          
          <AnimatePresence>
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <label className="block mb-2 text-sm font-medium text-forest-green font-sans">
                  First Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender font-sans transition-all"
                  placeholder="e.g. Jane"
                  required={mode === 'register'}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-forest-green font-sans">
              Handphone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender font-sans transition-all"
              placeholder="e.g. 91234567"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-forest-green font-sans">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender font-sans transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-white transition-all shadow-lg rounded-xl font-sans font-medium flex items-center justify-center gap-2 bg-nature-green hover:bg-nature-greenLight hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{mode === 'login' ? 'Authenticating...' : 'Creating...'}</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="w-full py-3 text-forest-green transition-all bg-transparent hover:bg-forest-green/5 active:scale-95 rounded-xl font-sans font-medium text-sm"
            >
              {mode === 'login' ? 'Create a new employee account' : 'Back to login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffLoginModal;
