import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import ServicesGrid from '../components/ServicesGrid';
import BookingTeaser from '../components/BookingTeaser';
import CanvasSequence from '../components/CanvasSequence';
import LoginModal from '../components/LoginModal';

function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="relative w-full selection:bg-lavender selection:text-white">
      <NavBar onOpenLogin={() => setIsLoginModalOpen(true)} />
      <main>
        <Hero onOpenLogin={() => setIsLoginModalOpen(true)} />
        <div className="relative z-20 bg-base-cream rounded-t-[3rem] shadow-2xl">
          <ServicesGrid />
          
          <div className="relative w-full overflow-hidden">
            <CanvasSequence folderName="image_sequence_2" frameCount={83} />
            <BookingTeaser onOpenLogin={() => setIsLoginModalOpen(true)} />
            <footer className="relative z-10 border-t border-white/10 text-center py-8">
              <p className="text-white/80 font-sans text-sm">
                &copy; {new Date().getFullYear()} NaturaSpa. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </main>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}

export default LandingPage;
