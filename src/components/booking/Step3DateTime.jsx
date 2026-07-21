import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { collection, collectionGroup, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { services, therapists } from '../../data/bookingData';

const Step3DateTime = ({ state, updateState, onNext, onBack }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get midnight today
  const getToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const today = getToday();
  const startViewDate = new Date(today);
  startViewDate.setDate(today.getDate() + (weekOffset * 7));

  // Generate the 7 days for the currently viewed week
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startViewDate);
    d.setDate(startViewDate.getDate() + i);
    return {
      dateObj: d,
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      monthNum: d.getMonth()
    };
  });

  const baseTimeSlots = [
    '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', 
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', 
    '09:00 PM', '10:00 PM', '11:00 PM'
  ];
  const currentHour = new Date().getHours();
  const allTherapistIds = therapists.filter(t => t.id !== 'any').map(t => t.id);

  const totalDuration = useMemo(() => {
    const serviceCat = Object.values(services).find(c => c.id === state.service);
    if (!serviceCat) return 60;
    const selectedOption = serviceCat.options.find(o => o.id === state.subOption);
    if (!selectedOption) return 60;
    
    let dur = selectedOption.duration || 60;
    if (state.addOns && state.addOns.length > 0 && selectedOption.addOns) {
      state.addOns.forEach(addId => {
        const addOn = selectedOption.addOns.find(a => a.id === addId);
        if (addOn) dur += addOn.duration;
      });
    }
    return dur;
  }, [state.service, state.subOption, state.addOns]);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const todayStr = getToday().toISOString().split('T')[0];
        let q;
        if (state.therapist === 'any') {
          q = query(collectionGroup(db, 'bookings'), where('date', '>=', todayStr));
        } else {
          q = query(collection(db, `therapists/${state.therapist}/bookings`), where('date', '>=', todayStr));
        }
        
        const querySnapshot = await getDocs(q);
        const fetched = [];
        querySnapshot.forEach(doc => fetched.push(doc.data()));
        setBookings(fetched);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.therapist]);

  const parseTime = (timeStr) => {
    let [hourStr, modifier] = timeStr.split(' ');
    let hour = parseInt(hourStr.split(':')[0], 10);
    if (modifier === 'PM' && hour !== 12) hour += 12;
    if (modifier === 'AM' && hour === 12) hour = 0;
    return hour * 60;
  };

  const generateSlotsForDate = (dateObj) => {
    const isToday = dateObj.getTime() === today.getTime();
    const isoDate = dateObj.toISOString().split('T')[0];
    const todaysBookings = bookings.filter(b => b.date === isoDate);
    
    return baseTimeSlots.filter(timeStr => {
      const slotStart = parseTime(timeStr);
      // Hide past hours completely
      return !(isToday && slotStart <= currentHour * 60);
    }).map(timeStr => {
      const slotStart = parseTime(timeStr);
      const slotEnd = slotStart + totalDuration;
      let available = true;
      
      if (state.therapist === 'any') {
        const busyTherapists = new Set();
        todaysBookings.forEach(b => {
          const bStart = parseTime(b.time);
          const bEnd = bStart + (b.duration || 60);
          if (slotStart < bEnd && slotEnd > bStart) {
            busyTherapists.add(b.therapistId);
          }
        });
        if (busyTherapists.size >= allTherapistIds.length) {
          available = false;
        }
      } else {
        const isBooked = todaysBookings.some(b => {
          const bStart = parseTime(b.time);
          const bEnd = bStart + (b.duration || 60);
          return slotStart < bEnd && slotEnd > bStart;
        });
        if (isBooked) available = false;
      }
      
      return { time: timeStr, available };
    });
  };

  const handleSlotClick = (isoDate, timeStr) => {
    let assigned = state.therapist;

    if (state.therapist === 'any') {
      const slotStart = parseTime(timeStr);
      const slotEnd = slotStart + totalDuration;
      const todaysBookings = bookings.filter(b => b.date === isoDate);
      
      const busyTherapists = new Set();
      todaysBookings.forEach(b => {
        const bStart = parseTime(b.time);
        const bEnd = bStart + (b.duration || 60);
        if (slotStart < bEnd && slotEnd > bStart) {
          busyTherapists.add(b.therapistId);
        }
      });
      
      const freeTherapists = allTherapistIds.filter(id => !busyTherapists.has(id));
      
      if (freeTherapists.length > 0) {
        const counts = {};
        freeTherapists.forEach(id => counts[id] = 0);
        todaysBookings.forEach(b => {
          if (counts[b.therapistId] !== undefined) counts[b.therapistId]++;
        });
        
        freeTherapists.sort((a, b) => counts[a] - counts[b]);
        assigned = freeTherapists[0]; // pick the one with least bookings
      }
    }

    updateState({ date: isoDate, time: timeStr, assignedTherapist: assigned });
  };

  const isComplete = state.date && state.time;
  const currentMonthDisplay = dates[0].month + ' ' + dates[0].dateObj.getFullYear();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6"
    >
      {/* Top Header Row */}
      <div className="flex justify-between items-center mb-2 px-2">
        <h2 className="font-serif text-4xl md:text-5xl text-nature-green">{currentMonthDisplay}</h2>
        <button 
          onClick={() => setWeekOffset(0)}
          className="text-base md:text-lg font-sans font-medium text-lavender hover:text-lavender-light transition-colors"
        >
          Back to Today
        </button>
      </div>

      {/* Legend */}
      <div className="flex justify-center md:justify-start px-2 items-center gap-6 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border-2 border-lavender/40"></div>
          <span className="text-sm font-sans text-nature-green/70">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-lavender bg-white"></div>
          <span className="text-sm font-sans text-nature-green/70">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-200"></div>
          <span className="text-sm font-sans text-nature-green/70">Staff Booked</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="bg-white rounded-[2rem] border border-nature-green/5 shadow-[0_10px_40px_rgba(0,0,0,0.03)] p-4 md:p-8 pt-12 md:pt-14 relative overflow-hidden">
        
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-lavender animate-spin" />
          </div>
        )}

        <button 
          onClick={() => setWeekOffset(prev => prev - 1)}
          disabled={weekOffset === 0}
          className={`absolute left-2 md:left-4 top-10 md:top-12 p-2 md:p-3 rounded-full transition-colors z-20 ${weekOffset === 0 ? 'text-nature-green/20 cursor-not-allowed' : 'text-nature-green bg-nature-green/5 hover:bg-nature-green/10 shadow-sm'}`}
        >
          <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
        </button>
        
        <button 
          onClick={() => setWeekOffset(prev => prev + 1)}
          className="absolute right-2 md:right-4 top-10 md:top-12 p-2 md:p-3 rounded-full text-nature-green bg-nature-green/5 hover:bg-nature-green/10 shadow-sm transition-colors z-20"
        >
          <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
        </button>

        <div className="overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-[600px] md:min-w-0">
            {/* Days Header Grid */}
            <div className="grid grid-cols-7 mb-6 relative px-12 md:px-16">
              {dates.map((d, index) => {
                const showMonthMarker = index > 0 && d.monthNum !== dates[index-1].monthNum;
                return (
                  <div key={d.iso} className="flex flex-col items-center relative">
                    {showMonthMarker && (
                      <div className="absolute left-0 top-0 -translate-x-1/2 -mt-8 flex flex-col items-center z-10">
                        <div className="bg-lavender text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-1 tracking-wider shadow-sm">
                          {d.month}
                        </div>
                        <div className="h-[400px] md:h-[500px] w-[2px] bg-gradient-to-b from-lavender/50 to-transparent"></div>
                      </div>
                    )}
                    <span className="text-sm md:text-base font-sans font-semibold uppercase tracking-widest text-nature-green/60">{d.dayName}</span>
                    <span className="font-serif text-3xl md:text-5xl text-nature-green mt-2">{d.dayNum}</span>
                  </div>
                );
              })}
            </div>

            <div className="w-full h-[2px] bg-nature-green/10 mb-8"></div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-7 gap-x-3 md:gap-x-6 px-12 md:px-16 min-h-[350px]">
              {dates.map((d) => {
                const slots = generateSlotsForDate(d.dateObj);
                return (
                  <div key={d.iso} className="flex flex-col gap-4 items-center">
                    {slots.map(({ time, available }) => {
                      const isSelected = state.date === d.iso && state.time === time;
                      return (
                        <button
                          key={`${d.iso}-${time}`}
                          disabled={!available}
                          onClick={() => handleSlotClick(d.iso, time)}
                          className={`w-full py-3 md:py-4 rounded-xl text-sm md:text-lg font-sans font-semibold transition-all duration-300 relative flex items-center justify-center whitespace-nowrap ${
                            isSelected 
                              ? 'border-2 border-lavender bg-white text-nature-green shadow-[0_4px_20px_rgba(150,123,182,0.3)] scale-110 z-10' 
                              : available 
                                ? 'bg-white text-nature-green/70 hover:bg-lavender/5 hover:text-nature-green border-2 border-lavender/40 hover:border-lavender'
                                : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-60'
                          }`}
                        >
                          {time.split(' ')[0]}
                          <span className="text-[10px] md:text-sm ml-1 font-medium">{time.split(' ')[1]}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-between items-center pt-6 border-t border-nature-green/10 mt-4">
        <button 
          onClick={onBack}
          className="px-6 py-4 rounded-full font-sans text-nature-green hover:bg-nature-green/10 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button 
          disabled={!isComplete}
          onClick={onNext}
          className={`px-12 py-4 rounded-full font-sans text-lg font-medium transition-all tracking-wide uppercase ${
            isComplete 
              ? 'bg-lavender text-white hover:bg-lavender-light shadow-[0_0_20px_rgba(156,140,185,0.4)] hover:shadow-[0_0_25px_rgba(156,140,185,0.6)] active:scale-95' 
              : 'bg-nature-green/10 text-nature-green/40 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Step3DateTime;
