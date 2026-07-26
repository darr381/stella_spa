import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BookingApp from './components/booking/BookingApp';
import StaffDashboard from './pages/StaffDashboard';
import MyAppointments from './pages/MyAppointments';
import { LanguageProvider } from './context/LanguageContext';
import LanguageSelectorModal from './components/LanguageSelectorModal';

function App() {
  return (
    <LanguageProvider>
      <LanguageSelectorModal />
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/my-appointments" element={<MyAppointments />} />
      <Route path="/book" element={<BookingApp />} />
      <Route path="/staff/dashboard" element={<StaffDashboard />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
