import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { services } from '../data/bookingData';
import AlertModal from '../components/AlertModal';
import { LogOut, Save, User, Clock, CalendarX2, Calendar as CalendarIcon, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [hours, setHours] = useState({ start: '', end: '', lunchStart: '', lunchEnd: '' });
  const [onLeave, setOnLeave] = useState({ isOut: false, startDate: '', endDate: '' });
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [tempLeave, setTempLeave] = useState({ startDate: '', endDate: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const stored = localStorage.getItem('naturaSpaStaff');
      if (!stored) {
        navigate('/');
        return;
      }
      
      const sessionUser = JSON.parse(stored);
      
      try {
        // Fetch fresh employee data
        const empRef = doc(db, 'employees', sessionUser.id);
        const empSnap = await getDoc(empRef);
        
        if (!empSnap.exists()) {
          localStorage.removeItem('naturaSpaStaff');
          navigate('/');
          return;
        }

        const empData = { id: empSnap.id, ...empSnap.data() };
        setEmployee(empData);
        
        // Init forms
        setName(empData.displayName || '');
        setProfilePicture(empData.profilePicture || '');
        setHours({
          start: empData.workingHours?.start || '10:00',
          end: empData.workingHours?.end || '22:00',
          lunchStart: empData.lunchBreak?.start || '12:00',
          lunchEnd: empData.lunchBreak?.end || '13:00'
        });
        
        setOnLeave({
          isOut: empData.onLeave?.isOut || false,
          startDate: empData.onLeave?.startDate || '',
          endDate: empData.onLeave?.endDate || ''
        });

        // 1. Silent Cleanup: Delete old bookings for this specific employee
        try {
          const expiredQ = query(
            collection(db, `therapists/${empData.id}/bookings`),
            where('expireAt', '<', new Date())
          );
          const expiredSnap = await getDocs(expiredQ);
          const deletePromises = expiredSnap.docs.map(docSnap => 
            deleteDoc(doc(db, `therapists/${empData.id}/bookings`, docSnap.id))
          );
          await Promise.all(deletePromises);
        } catch (cleanupErr) {
          console.error("Cleanup failed:", cleanupErr);
        }

        // 2. Fetch remaining (future) bookings
        const q = query(collection(db, `therapists/${empData.id}/bookings`));
        const bookingSnap = await getDocs(q);
        const fetchedBookings = bookingSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Sort bookings by date and time
        fetchedBookings.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA - dateB;
        });

        setBookings(fetchedBookings);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('naturaSpaStaff');
    navigate('/');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const empRef = doc(db, 'employees', employee.id);
      await updateDoc(empRef, {
        displayName: name,
        profilePicture,
        workingHours: {
          start: hours.start,
          end: hours.end
        },
        lunchBreak: {
          start: hours.lunchStart,
          end: hours.lunchEnd
        },
        onLeave: {
          isOut: onLeave.isOut,
          startDate: onLeave.isOut ? onLeave.startDate : '',
          endDate: onLeave.isOut ? onLeave.endDate : ''
        }
      });
      showToast('Changes have been saved');
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast('Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-base-cream flex items-center justify-center font-serif text-2xl text-nature-green">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-base-cream font-sans text-nature-green selection:bg-lavender selection:text-white pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-nature-green/10 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-lavender/30" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-nature-green/10 flex items-center justify-center">
                <User className="w-6 h-6 text-nature-green" />
              </div>
            )}
            <div>
              <h1 className="font-serif text-2xl font-medium">{employee.displayName}</h1>
              <p className="text-sm opacity-60">Staff Dashboard</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition-colors font-medium">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Profile Settings */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-nature-green/5">
            <div className="flex items-center gap-3 mb-6 border-b border-nature-green/10 pb-4">
              <User className="w-5 h-5 opacity-70" />
              <h2 className="font-serif text-xl">Profile Settings</h2>
            </div>
            
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
              
              <div className="flex flex-col items-center mb-2">
                <div className="relative mb-3 group">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-base-cream shadow-md" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-nature-green/10 flex items-center justify-center border-4 border-base-cream shadow-md">
                      <User className="w-10 h-10 text-nature-green/60" />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer">
                  <span className="text-sm font-medium text-nature-green bg-nature-green/10 hover:bg-nature-green/20 px-4 py-2 rounded-full transition-colors">
                    Change Profile Pic
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const img = new Image();
                        img.onload = () => {
                          const canvas = document.createElement('canvas');
                          const MAX_WIDTH = 256;
                          const MAX_HEIGHT = 256;
                          let width = img.width;
                          let height = img.height;
                          
                          if (width > height) {
                            if (width > MAX_WIDTH) {
                              height *= MAX_WIDTH / width;
                              width = MAX_WIDTH;
                            }
                          } else {
                            if (height > MAX_HEIGHT) {
                              width *= MAX_HEIGHT / height;
                              height = MAX_HEIGHT;
                            }
                          }
                          
                          canvas.width = width;
                          canvas.height = height;
                          const ctx = canvas.getContext('2d');
                          ctx.drawImage(img, 0, 0, width, height);
                          
                          // Compress to base64 JPEG
                          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                          setProfilePicture(dataUrl);
                        };
                        img.src = ev.target.result;
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Display Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                  onBlur={async () => {
                    if (name.trim() && name !== employee.displayName) {
                      try {
                        const empRef = doc(db, 'employees', employee.id);
                        await updateDoc(empRef, { displayName: name });
                        setEmployee(prev => ({ ...prev, displayName: name }));
                      } catch(err) {
                        console.error('Failed to update name', err);
                      }
                    }
                  }}
                  className="p-3 bg-base-cream/50 rounded-xl border border-nature-green/10 focus:border-lavender focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 mt-4 border-t border-nature-green/10 pt-6 mb-2">
                <Clock className="w-5 h-5 opacity-70" />
                <h3 className="font-serif text-lg">Working Hours</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Shift Start</label>
                  <input type="time" value={hours.start} onChange={e => setHours({...hours, start: e.target.value})} className="p-3 bg-base-cream/50 rounded-xl border border-nature-green/10 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Shift End</label>
                  <input type="time" value={hours.end} onChange={e => setHours({...hours, end: e.target.value})} className="p-3 bg-base-cream/50 rounded-xl border border-nature-green/10 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Lunch Start</label>
                  <input type="time" value={hours.lunchStart} onChange={e => setHours({...hours, lunchStart: e.target.value})} className="p-3 bg-base-cream/50 rounded-xl border border-nature-green/10 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-70">Lunch End</label>
                  <input type="time" value={hours.lunchEnd} onChange={e => setHours({...hours, lunchEnd: e.target.value})} className="p-3 bg-base-cream/50 rounded-xl border border-nature-green/10 focus:outline-none" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 border-t border-nature-green/10 pt-6 mb-2">
                <div className="flex items-center gap-3">
                  <CalendarX2 className="w-5 h-5 opacity-70" />
                  <h3 className="font-serif text-lg">Leave Status</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setTempLeave({ startDate: onLeave.startDate || '', endDate: onLeave.endDate || '' });
                    setShowLeaveModal(true);
                  }}
                  className="px-4 py-2 bg-lavender/10 text-lavender rounded-full text-sm font-medium hover:bg-lavender/20 transition-colors"
                >
                  Set Leave
                </button>
              </div>

              {onLeave.isOut && onLeave.startDate && onLeave.endDate && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex justify-between items-center mt-2 animate-in fade-in slide-in-from-top-2">
                  <div className="flex flex-col">
                    <span className="text-red-800 font-medium text-sm">Scheduled Leave</span>
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {new Date(onLeave.startDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})} to {new Date(onLeave.endDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setOnLeave({ isOut: false, startDate: '', endDate: '' })}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-colors"
                    title="Cancel Leave"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                disabled={saving}
                className="mt-6 flex items-center justify-center gap-2 bg-nature-green text-white py-4 rounded-xl font-medium hover:bg-nature-greenLight transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-nature-green/5 min-h-[600px]">
            <div className="flex justify-between items-center border-b border-nature-green/10 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-lavender" />
                <h2 className="font-serif text-2xl">Upcoming Appointments</h2>
              </div>
              <div className="text-sm font-medium opacity-60 bg-base-cream px-4 py-2 rounded-full">
                {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center opacity-60">
                <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg">Your schedule is completely clear.</p>
                <p className="text-sm mt-1">Enjoy the tranquility.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex flex-col md:flex-row gap-4 md:items-center justify-between p-5 rounded-2xl bg-base-cream/30 hover:bg-base-cream/70 transition-colors border border-nature-green/5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-xl font-medium text-lavender">{new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}</span>
                        <span className="font-sans font-semibold text-lg">{booking.time}</span>
                      </div>
                      <h4 className="font-medium text-nature-green">{booking.customerName}</h4>
                      <p className="text-sm opacity-70 flex items-center gap-2">
                        <span>{booking.customerPhone}</span>
                      </p>
                    </div>
                    
                    <div className="text-right flex flex-col md:items-end gap-1">
                      <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-bold uppercase tracking-wider border border-nature-green/10">
                        {services[booking.service]?.name || booking.service}
                      </span>
                      {booking.addOns && booking.addOns.length > 0 && (
                        <span className="text-xs opacity-60">+{booking.addOns.length} Add-on{booking.addOns.length > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Leave Modal Overlay */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-2xl relative">
            <button 
              onClick={() => setShowLeaveModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-black/50"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl text-nature-green mb-6">Schedule Leave</h3>
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70 text-nature-green">Start Date</label>
                <input 
                  type="date" 
                  value={tempLeave.startDate} 
                  onChange={e => setTempLeave({...tempLeave, startDate: e.target.value})}
                  className="p-3 bg-base-cream/50 rounded-xl border border-nature-green/10 focus:border-lavender focus:outline-none text-nature-green" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70 text-nature-green">End Date</label>
                <input 
                  type="date" 
                  value={tempLeave.endDate} 
                  min={tempLeave.startDate}
                  onChange={e => setTempLeave({...tempLeave, endDate: e.target.value})}
                  className="p-3 bg-base-cream/50 rounded-xl border border-nature-green/10 focus:border-lavender focus:outline-none text-nature-green" 
                />
              </div>
              
              <button 
                onClick={() => {
                  if (tempLeave.startDate && tempLeave.endDate) {
                    setOnLeave({ isOut: true, startDate: tempLeave.startDate, endDate: tempLeave.endDate });
                    setShowLeaveModal(false);
                  } else {
                    setModalConfig({
                      isOpen: true,
                      title: 'Missing Dates',
                      message: 'Please select both start and end dates.'
                    });
                  }
                }}
                className="mt-4 w-full bg-nature-green text-white py-4 rounded-xl font-medium hover:bg-nature-greenLight transition-all active:scale-95"
              >
                Confirm Leave Range
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-8 right-8 z-[9999] px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-nature-green text-white'
            }`}
          >
            {toast.type === 'error' ? <X className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span className="font-sans font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </div>
  );
};

export default StaffDashboard;
