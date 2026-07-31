import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collectionGroup, query, where, getDocs, doc, deleteDoc, collection, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { services } from '../data/bookingData';
import { Calendar as CalendarIcon, Clock, ArrowLeft, Plus, Trash2, Edit2, Loader2, User, Save, X } from 'lucide-react';
import AlertModal from '../components/AlertModal';
import { useLanguage } from '../context/LanguageContext';

const MyAppointments = () => {
  const { t } = useLanguage();
  const { user, updateUserSession } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'alert', title: '', message: '', onConfirm: null });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');

  const getServiceName = (id) => services[id]?.name || id;
  const getAddonName = (serviceId, id) => services[serviceId]?.addOns?.find(a => a.id === id)?.name || id;

  const handleDelete = (booking) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: t('appointments.cancelAppointment'),
      message: `${t('appointments.cancelConfirm1')}${new Date(booking.date).toLocaleDateString()}${t('appointments.cancelConfirm2')}${booking.time}?`,
      onConfirm: () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        executeDelete(booking);
      }
    });
  };

  const executeDelete = async (booking) => {
    setDeletingId(booking.id);
    try {
      await deleteDoc(doc(db, `therapists/${booking.therapistId}/bookings`, booking.id));
      setBookings(prev => prev.filter(b => b.id !== booking.id));
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setModalConfig({
        isOpen: true,
        type: 'alert',
        title: t('appointments.error'),
        message: t('appointments.cancelError'),
        onConfirm: null
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim() || !profileData.phone.trim()) {
      setProfileError(t('appointments.namePhoneRequired'));
      return;
    }
    
    // Validate phone number format (starts with 8 or 9, exactly 8 digits)
    if (!/^[89]\d{7}$/.test(profileData.phone)) {
      setProfileError(t('appointments.phoneInvalid'));
      return;
    }

    setProfileSaving(true);
    setProfileError('');
    
    try {
      const oldPhone = user.phone;
      const newPhone = profileData.phone;
      const newName = profileData.name;
      
      // If phone changed, check uniqueness
      if (oldPhone !== newPhone) {
        const checkSnap = await getDoc(doc(db, 'users', newPhone));
        if (checkSnap.exists()) {
          setProfileError(t('appointments.phoneExists'));
          setProfileSaving(false);
          return;
        }
        
        // 1. Create new user doc
        await setDoc(doc(db, 'users', newPhone), {
          name: newName,
          phone: newPhone,
          createdAt: new Date()
        });
        
        // 2. Delete old user doc
        await deleteDoc(doc(db, 'users', oldPhone));
      } else if (user.name !== newName) {
        // Just update the name
        await updateDoc(doc(db, 'users', oldPhone), { name: newName });
      } else {
        // Nothing changed
        setShowProfileModal(false);
        setProfileSaving(false);
        return;
      }
      
      // Update all bookings for this user across all therapists
      const bookingsQ = query(collectionGroup(db, 'bookings'), where('customerPhone', '==', oldPhone));
      const bookingsSnap = await getDocs(bookingsQ);
      
      const updatePromises = bookingsSnap.docs.map(docSnap => {
        // Reconstruct the exact path to this booking document
        // docSnap.ref gives us the DocumentReference
        return updateDoc(docSnap.ref, {
          customerName: newName,
          customerPhone: newPhone
        });
      });
      
      await Promise.all(updatePromises);
      
      // Update context and close
      updateUserSession({ id: newPhone, name: newName, phone: newPhone });
      setShowProfileModal(false);
      
      // Show success alert
      setModalConfig({
        isOpen: true,
        type: 'alert',
        title: t('appointments.profileUpdated'),
        message: t('appointments.profileUpdatedDesc'),
        onConfirm: null
      });
      
    } catch (err) {
      console.error('Failed to update profile:', err);
      setProfileError(t('appointments.profileUpdateError'));
    } finally {
      setProfileSaving(false);
    }
  };

  useEffect(() => {
    // If not logged in, send them back to the landing page
    if (!user || !user.phone) {
      navigate('/');
      return;
    }

    const fetchAppointments = async () => {
      try {
        // Prepare queries
        const q = query(
          collectionGroup(db, 'bookings'),
          where('customerPhone', '==', user.phone)
        );
        
        // Fetch in parallel
        const [snapshot, empSnapshot] = await Promise.all([
          getDocs(q),
          getDocs(collection(db, 'employees'))
        ]);
        
        const getLocalISODate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        const todayISO = getLocalISODate(new Date());

        let fetchedBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        fetchedBookings = fetchedBookings.filter(b => b.date >= todayISO);

        // Sort by date and time
        fetchedBookings.sort((a, b) => {
          const dateA = new Date(`${a.date}T00:00:00`);
          const dateB = new Date(`${b.date}T00:00:00`);
          if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
          
          const timeA = a.time || '';
          const timeB = b.time || '';
          return timeA.localeCompare(timeB);
        });

        // Map employees
        const empMap = {};
        empSnapshot.forEach(doc => {
          empMap[doc.id] = doc.data().displayName || doc.data().name;
        });
        setEmployees(empMap);

        setBookings(fetchedBookings);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-cream flex items-center justify-center font-serif text-2xl text-nature-green">
        {t('appointments.loadingAppointments')}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-cream font-sans text-nature-green selection:bg-lavender selection:text-white pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-nature-green/10 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-nature-green hover:text-lavender transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('appointments.backToHome')}
          </button>
          <div className="font-serif text-xl font-medium">
            {t('appointments.myAppointments')}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-nature-green mb-2">
              {t('appointments.hello')}{user?.name?.split(' ')[0]}
            </h1>
            <p className="text-nature-green/70">
              {t('appointments.upcomingDesc')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setProfileData({ name: user?.name || '', phone: user?.phone || '' });
                setProfileError('');
                setShowProfileModal(true);
              }}
              className="flex items-center gap-2 bg-white text-nature-green hover:bg-base-cream border border-nature-green/10 px-6 py-3 rounded-full font-medium shadow-sm transition-all active:scale-95"
            >
              <User className="w-5 h-5" />
              {t('appointments.profile')}
            </button>
            <button 
              onClick={() => navigate('/book')}
              className="flex items-center gap-2 bg-nature-green text-white hover:bg-nature-greenLight px-6 py-3 rounded-full font-medium shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              {t('appointments.newBooking')}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-nature-green/5 min-h-[400px]">
          <div className="flex justify-between items-center border-b border-nature-green/10 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-lavender" />
              <h2 className="font-serif text-2xl">{t('appointments.yourSchedule')}</h2>
            </div>
            <div className="text-sm font-medium opacity-60 bg-base-cream px-4 py-2 rounded-full">
              {bookings.length} {bookings.length === 1 ? t('appointments.bookingCount') : t('appointments.bookingsCount')}
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center opacity-60">
              <CalendarIcon className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-xl font-serif">{t('appointments.noAppointments')}</p>
              <p className="text-sm mt-2 font-sans">{t('appointments.treatYourself')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex flex-col md:flex-row gap-4 md:items-center justify-between p-6 rounded-2xl bg-base-cream/30 hover:bg-base-cream/70 transition-colors border border-nature-green/5"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-2xl font-medium text-lavender">
                        {new Date(booking.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}
                      </span>
                      <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-nature-green/10 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-nature-green/70" />
                        <span className="font-sans font-semibold text-sm">{booking.time}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <h4 className="font-bold text-nature-green text-lg">{getServiceName(booking.service)}</h4>
                      {booking.addOns && booking.addOns.length > 0 && (
                        <p className="text-sm opacity-70 mt-1">
                          {t('appointments.includes')}{booking.addOns.map(id => getAddonName(booking.service, id)).join(', ')}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 mt-2 text-nature-green/70 text-sm">
                        <User className="w-3.5 h-3.5" />
                        <span>{employees[booking.therapistId] || t('booking.staff')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col md:items-end gap-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-nature-green/10">
                    <span className="inline-block px-4 py-2 bg-white rounded-xl text-sm font-medium border border-nature-green/10 shadow-sm">
                      {booking.duration} {t('booking.minutes')}
                    </span>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => navigate('/book', { state: { editBooking: booking } })}
                        className="p-2 text-lavender hover:bg-lavender/10 rounded-full transition-colors relative group"
                        title="Modify to change date or time of booking"
                      >
                        <Edit2 className="w-5 h-5" />
                        {/* Custom Tooltip */}
                        <div className="absolute bottom-full right-0 mb-2 w-max px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Modify to change date or time
                          <div className="absolute top-full right-3 border-[5px] border-transparent border-t-gray-900"></div>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(booking)}
                        disabled={deletingId === booking.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                        title={t('appointments.cancelAppointment')}
                      >
                        {deletingId === booking.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AlertModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
      />

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-2xl relative">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-black/50"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl text-nature-green mb-6">{t('appointments.editProfile')}</h3>
            
            {profileError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                {profileError}
              </div>
            )}
            
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70 text-nature-green">{t('appointments.fullName')}</label>
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={e => setProfileData({...profileData, name: e.target.value.replace(/[^a-zA-Z\s]/g, '')})}
                  placeholder={t('appointments.enterName')}
                  className="p-3 bg-base-cream/50 rounded-xl border border-nature-green/10 focus:border-lavender focus:outline-none text-nature-green" 
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70 text-nature-green">{t('appointments.handphoneNumber')}</label>
                <div className="flex items-center">
                  <div className="p-3 bg-base-cream/50 rounded-l-xl border border-r-0 border-nature-green/10 text-nature-green font-medium">
                    +65
                  </div>
                  <input 
                    type="tel" 
                    value={profileData.phone} 
                    onChange={e => setProfileData({...profileData, phone: e.target.value.replace(/\D/g, '').slice(0, 8)})}
                    placeholder="8xxx xxxx or 9xxx xxxx"
                    className="p-3 bg-base-cream/50 rounded-r-xl border border-nature-green/10 focus:border-lavender focus:outline-none text-nature-green w-full" 
                    required
                  />
                </div>
                <p className="text-xs text-nature-green/50 mt-1">{t('appointments.updateLoginId')}</p>
              </div>
              
              <button 
                type="submit"
                disabled={profileSaving}
                className="mt-4 flex items-center justify-center gap-2 w-full bg-nature-green text-white py-4 rounded-xl font-medium hover:bg-nature-greenLight transition-all active:scale-95 disabled:opacity-50"
              >
                {profileSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {profileSaving ? t('appointments.saving') : t('appointments.saveProfile')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
