import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import WizardProgress from './WizardProgress';
import Step1ServiceSelection from './Step1ServiceSelection';
import Step2Therapist from './Step2Therapist';
import Step3DateTime from './Step3DateTime';
import Step4Checkout from './Step4Checkout';
import ReceiptSidebar from './ReceiptSidebar';
import { useAuth } from '../../context/AuthContext';

const BookingApp = () => {
  const { user: authUser } = useAuth();

  const [bookingState, setBookingState] = useState({
    step: 1,
    service: null, // e.g., 'hairCut'
    subOption: null, // e.g., 'hc_f'
    addOns: [], // Array of add-on IDs
    therapist: 'any',
    date: null,
    time: null,
    user: { name: authUser?.name || '', phone: authUser?.phone || '' }
  });

  const nextStep = () => setBookingState(prev => ({ ...prev, step: Math.min(prev.step + 1, 4) }));
  const prevStep = () => setBookingState(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  const updateState = (updates) => setBookingState(prev => ({ ...prev, ...updates }));

  return (
    <div className="min-h-screen bg-base-cream flex flex-col md:flex-row selection:bg-lavender selection:text-white overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-[100dvh] overflow-y-auto relative">
        <header className="p-6 md:p-10 flex justify-between items-center z-10 sticky top-0 bg-base-cream/90 backdrop-blur-md border-b border-nature-green/5">
          <Link to="/" className="text-nature-green hover:text-lavender transition-colors flex items-center gap-2 font-sans font-medium bg-white px-4 py-2 rounded-full shadow-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Sanctuary
          </Link>
          <span className="font-serif text-2xl font-semibold text-nature-green tracking-wide">NaturaSpa</span>
        </header>

        <main className="flex-1 px-6 md:px-10 lg:px-20 max-w-[75vw] mx-auto w-full pt-10 pb-32 md:pb-20">
          <WizardProgress currentStep={bookingState.step} />
          
          <div className="mt-16 relative">
            {bookingState.step === 1 && <Step1ServiceSelection state={bookingState} updateState={updateState} onNext={nextStep} />}
            {bookingState.step === 2 && <Step2Therapist state={bookingState} updateState={updateState} onNext={nextStep} onBack={prevStep} />}
            {bookingState.step === 3 && <Step3DateTime state={bookingState} updateState={updateState} onNext={nextStep} onBack={prevStep} />}
            {bookingState.step === 4 && <Step4Checkout state={bookingState} updateState={updateState} onBack={prevStep} />}
          </div>
        </main>
      </div>

      {/* Receipt Sidebar */}
      <div className="hidden md:block w-[350px] lg:w-[450px] bg-white border-l border-nature-green/10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-20">
        <ReceiptSidebar state={bookingState} />
      </div>
      
      {/* Mobile Receipt Floating Bar (for small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50">
        <ReceiptSidebar state={bookingState} isMobile />
      </div>
    </div>
  );
};

export default BookingApp;
