import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collectionGroup, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Calendar as CalendarIcon, Clock, ArrowLeft, Plus } from 'lucide-react';

const MyAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
                      <h4 className="font-bold text-nature-green text-lg">{booking.service}</h4>
                      {booking.addOns && booking.addOns.length > 0 && (
                        <p className="text-sm opacity-70 mt-1">
                          Includes: {booking.addOns.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col md:items-end gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-nature-green/10">
                    <span className="inline-block px-4 py-2 bg-white rounded-xl text-sm font-medium border border-nature-green/10 shadow-sm">
                      {booking.duration} Minutes
                    </span>
                    <span className="text-xs opacity-60 flex items-center gap-1">
                      Assigned to Therapist
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default MyAppointments;
