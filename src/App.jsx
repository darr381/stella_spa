import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BookingApp from './components/booking/BookingApp';
import StaffDashboard from './pages/StaffDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/book" element={<BookingApp />} />
      <Route path="/staff/dashboard" element={<StaffDashboard />} />
    </Routes>
  );
}

export default App;
