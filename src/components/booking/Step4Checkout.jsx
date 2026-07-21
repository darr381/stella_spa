import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { services, therapists } from '../../data/bookingData';

const Step4Checkout = ({ state, updateState, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleInputChange = (e) => {
    updateState({ user: { ...state.user, [e.target.name]: e.target.value } });
  };

  const isComplete = state.user.name.length > 2 && state.user.phone.length > 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isComplete) return;
    setIsSubmitting(true);
    
    try {
      const assignedId = state.assignedTherapist || state.therapist;
      
      const serviceCat = Object.values(services).find(c => c.id === state.service);
      const selectedOption = serviceCat?.options.find(o => o.id === state.subOption);
      let totalDuration = selectedOption?.duration || 60;
      if (state.addOns && state.addOns.length > 0 && selectedOption?.addOns) {
        state.addOns.forEach(addId => {
          const addOn = selectedOption.addOns.find(a => a.id === addId);
          if (addOn) totalDuration += addOn.duration;
        });
      }

      // Check double booking
      const q = query(collection(db, `therapists/${assignedId}/bookings`), where('date', '==', state.date));
      const snapshot = await getDocs(q);
      
      const parseTime = (timeStr) => {
        let [hourStr, modifier] = timeStr.split(' ');
        let hour = parseInt(hourStr.split(':')[0], 10);
        if (modifier === 'PM' && hour !== 12) hour += 12;
        if (modifier === 'AM' && hour === 12) hour = 0;
        return hour * 60;
      };

      const myStart = parseTime(state.time);
      const myEnd = myStart + totalDuration;
      let hasOverlap = false;

      snapshot.forEach(doc => {
        const b = doc.data();
        const bStart = parseTime(b.time);
        const bEnd = bStart + (b.duration || 60);
        if (myStart < bEnd && myEnd > bStart) {
          hasOverlap = true;
        }
      });

      if (hasOverlap) {
        alert("This time slot was just booked by someone else! Please choose another time.");
        setIsSubmitting(false);
        return;
      }

      const expireDate = new Date(state.date);
      expireDate.setDate(expireDate.getDate() + 1); // Day after
      expireDate.setHours(23, 59, 59, 999); // End of that day

      const bookingData = {
        customerName: state.user.name,
        customerPhone: state.user.phone,
        service: state.service,
        addOns: state.addOns || [],
        therapistId: assignedId,
        date: state.date,
        time: state.time,
        duration: totalDuration,
        expireAt: expireDate,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, `therapists/${assignedId}/bookings`), bookingData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Booking error: ", error);
      alert("There was an error securing your appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Format service name
    const serviceName = state.service ? state.service.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Treatment';
    const dateStr = state.date ? new Date(state.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
    
    const assignedId = state.assignedTherapist || state.therapist;
    const assignedTherapistObj = therapists.find(t => t.id === assignedId);
    const assignedName = assignedTherapistObj ? assignedTherapistObj.name : 'Staff';

    const messageText = `Hi! This is a reminder for my upcoming booking at NaturaSpa.\n\nService: ${serviceName}\nTherapist: ${assignedName}\nDate: ${dateStr}\nTime: ${state.time}\n\nSee you there!`;
    const encodedText = encodeURIComponent(messageText);

    const handleCopy = () => {
      navigator.clipboard.writeText(messageText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    };

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center py-6 gap-6 w-full"
      >
        <div className="w-20 h-20 rounded-full bg-nature-green/10 flex items-center justify-center text-nature-green mb-2">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-5xl text-nature-green">Booking Confirmed</h2>
        
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl mx-auto mt-4 px-4">
          
          {/* Share Box */}
          <div className="flex-1 bg-white p-8 rounded-[2rem] border border-nature-green/5 shadow-sm flex flex-col justify-center">
            <p className="text-nature-green font-sans text-lg font-medium leading-relaxed mb-8">
              Would you like to save your booking details by sending it to yourself in WhatsApp, Telegram, or Email?
            </p>
            
            <div className="flex justify-center gap-6 md:gap-8 items-center mb-6">
              <a 
                href={isMobile ? `https://wa.me/?text=${encodedText}` : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isMobile 
                    ? 'bg-[#25D366]/10 hover:bg-[#25D366]/20 hover:scale-110' 
                    : 'bg-gray-100 opacity-50 grayscale cursor-not-allowed pointer-events-none'
                }`}
              >
                <img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-8 h-8" />
              </a>

              <a 
                href={isMobile ? `https://t.me/share/url?url=&text=${encodedText}` : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isMobile 
                    ? 'bg-[#0088cc]/10 hover:bg-[#0088cc]/20 hover:scale-110' 
                    : 'bg-gray-100 opacity-50 grayscale cursor-not-allowed pointer-events-none'
                }`}
              >
                <img src="/icons/telegram.svg" alt="Telegram" className="w-8 h-8" />
              </a>

              <a 
                href={`mailto:?subject=NaturaSpa Booking Details&body=${encodedText}`}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all bg-lavender/10 hover:bg-lavender/20 hover:scale-110"
              >
                <img src="/icons/email.svg" alt="Email" className="w-8 h-8" />
              </a>
            </div>

            {!isMobile && (
              <p className="text-sm text-nature-green/50 italic px-4 mt-auto">
                * Only mobile devices can send booking details to WhatsApp and Telegram.
              </p>
            )}
          </div>

          {/* Details Box */}
          <div className="flex-1 bg-white p-8 rounded-[2rem] border border-nature-green/5 shadow-sm text-left flex flex-col relative overflow-hidden">
             {/* decorative blob */}
             <div className="absolute top-0 right-0 w-48 h-48 bg-nature-green/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
             
             <h3 className="font-serif text-3xl text-nature-green mb-6 relative z-10">Appointment Details</h3>
             
             <div className="flex flex-col gap-5 font-sans text-nature-green/80 relative z-10 mb-8">
               <div className="flex flex-col">
                 <span className="text-xs font-bold uppercase tracking-widest text-nature-green/40">Service</span>
                 <span className="text-xl font-medium text-nature-green">{serviceName}</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-xs font-bold uppercase tracking-widest text-nature-green/40">Therapist</span>
                 <span className="text-xl font-medium text-nature-green">{assignedName}</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-xs font-bold uppercase tracking-widest text-nature-green/40">Date</span>
                 <span className="text-xl font-medium text-nature-green">{dateStr}</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-xs font-bold uppercase tracking-widest text-nature-green/40">Time</span>
                 <span className="text-xl font-medium text-nature-green">{state.time}</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-xs font-bold uppercase tracking-widest text-nature-green/40">Guest</span>
                 <span className="text-xl font-medium text-nature-green">{state.user.name}</span>
               </div>
             </div>

             <button
               onClick={handleCopy}
               className={`mt-auto w-full py-4 rounded-xl flex items-center justify-center gap-3 font-sans font-medium transition-colors relative z-10 border-2 ${
                 isCopied 
                  ? 'border-lavender/20 bg-lavender/5 text-lavender' 
                  : 'border-transparent bg-nature-green/5 text-nature-green hover:bg-nature-green/10'
               }`}
             >
               {isCopied ? (
                 <>
                   <Check className="w-5 h-5" />
                   <span>Copied to Clipboard!</span>
                 </>
               ) : (
                 <>
                   <Copy className="w-5 h-5" />
                   <span>Copy Booking Details for Easy Pasting</span>
                 </>
               )}
             </button>
          </div>

        </div>

        <Link 
          to="/"
          className="mt-8 px-12 py-4 rounded-full font-sans text-lg font-medium transition-all bg-nature-green text-white hover:bg-nature-greenLight shadow-lg active:scale-95"
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
          <label className="text-sm font-medium text-nature-green/80 uppercase tracking-wider pl-2">Name</label>
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
