import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collectionGroup, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { services } from '../data/bookingData';
import { Calendar as CalendarIcon, Clock, ArrowLeft, Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import AlertModal from '../components/AlertModal';

const MyAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'alert', title: '', message: '', onConfirm: null });

  const handleDelete = (booking) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Cancel Appointment',
      message: `Are you sure you want to cancel your appointment on ${new Date(booking.date).toLocaleDateString()} at ${booking.time}?`,
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
        title: 'Error',
        message: 'Failed to cancel the appointment. Please try again.',
        onConfirm: null
      });
    } finally {
      setDeletingId(null);
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
        // Query ALL bookings across ALL therapists for this customer
        const q = query(
          collectionGroup(db, 'bookings'),
          where('customerPhone', '==', user.phone)
        );
        
        const snapshot = await getDocs(q);
        const fetchedBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort by date and time
        fetchedBookings.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA - dateB;
        });

        setBookings(fetchedBookings);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-cream flex items-center justify-center font-serif text-2xl text-nature-green">
        Loading your appointments...
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
            Back to Home
          </button>
          <div className="font-serif text-xl font-medium">
            My Appointments
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-nature-green mb-2">
              Hello, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-nature-green/70">
              Here are your upcoming appointments.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/book')}
            className="flex items-center gap-2 bg-nature-green text-white hover:bg-nature-greenLight px-6 py-3 rounded-full font-medium shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Book New Appointment
          </button>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-nature-green/5 min-h-[400px]">
          <div className="flex justify-between items-center border-b border-nature-green/10 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-lavender" />
              <h2 className="font-serif text-2xl">Your Schedule</h2>
            </div>
            <div className="text-sm font-medium opacity-60 bg-base-cream px-4 py-2 rounded-full">
              {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center opacity-60">
              <CalendarIcon className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-xl font-serif">You have no upcoming appointments.</p>
              <p className="text-sm mt-2 font-sans">Treat yourself to a relaxing spa session today.</p>
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
                        {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}
                      </span>
                      <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-nature-green/10 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-nature-green/70" />
                        <span className="font-sans font-semibold text-sm">{booking.time}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <h4 className="font-bold text-nature-green text-lg">{services[booking.service]?.name || booking.service}</h4>
                      {booking.addOns && booking.addOns.length > 0 && (
                        <p className="text-sm opacity-70 mt-1">
                          Includes: {booking.addOns.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col md:items-end gap-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-nature-green/10">
                    <span className="inline-block px-4 py-2 bg-white rounded-xl text-sm font-medium border border-nature-green/10 shadow-sm">
                      {booking.duration} Minutes
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
                        title="Cancel Appointment"
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
    </div>
  );
};

export default MyAppointments;
