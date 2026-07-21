import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Check, ArrowLeft, User, CalendarX2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Step2Therapist = ({ state, updateState, onNext, onBack }) => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'employees'));
        const employeesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Add "Any Available" option explicitly
        employeesList.push({
          id: 'any',
          name: 'Any Available Therapist',
          specialty: 'First Available',
          profilePicture: null
        });
        
        setTherapists(employeesList);
      } catch (err) {
        console.error("Error fetching therapists:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapists();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-10"
    >
      <div>
        <h2 className="font-serif text-3xl text-nature-green mb-2">Choose Your Therapist</h2>
        <p className="text-nature-green/60 font-sans">Select a specialist for your appointment.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10 text-nature-green">Loading specialists...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {therapists.map(therapist => {
            const isSelected = state.therapist === therapist.id;
            const isOnLeave = therapist.onLeave?.isOut;
            
            return (
              <button
                key={therapist.id}
                onClick={() => updateState({ therapist: therapist.id, therapistDetails: therapist })}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 flex items-center gap-6 relative overflow-hidden ${
                  isSelected 
                    ? 'border-nature-green bg-nature-green/5 shadow-md' 
                    : 'border-white bg-white hover:border-lavender/50 hover:bg-lavender/5 shadow-sm'
                }`}
              >
                {therapist.profilePicture ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 shadow-inner">
                    <img src={therapist.profilePicture} alt={therapist.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-lavender/20 flex items-center justify-center shrink-0 text-lavender">
                    <User className="w-6 h-6" />
                  </div>
                )}
                
                <div className="flex flex-col items-start flex-1 text-left">
                  <span className="font-sans font-medium text-nature-green text-xl">{therapist.displayName || therapist.name}</span>
                  <span className="text-nature-green/70 text-sm mb-2">Specialist</span>
                  {isOnLeave && therapist.onLeave?.startDate && therapist.onLeave?.endDate && (
                    <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-md mt-1">
                      <CalendarX2 className="w-3 h-3" />
                      <span className="text-xs font-medium">Leave: {new Date(therapist.onLeave.startDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})} - {new Date(therapist.onLeave.endDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
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
      )}

      <div className="flex justify-between items-center pt-8 border-t border-nature-green/10 mt-8">
        <button 
          onClick={onBack}
          className="px-6 py-4 rounded-full font-sans text-nature-green hover:bg-nature-green/10 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button 
          onClick={onNext}
          disabled={!state.therapist}
          className="px-10 py-4 rounded-full font-sans text-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-nature-green text-white hover:bg-nature-greenLight shadow-lg hover:shadow-xl active:scale-95"
        >
          Select Date & Time
        </button>
      </div>
    </motion.div>
  );
};

export default Step2Therapist;
