import React from 'react';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import ServicesGrid from './components/ServicesGrid';
import BookingTeaser from './components/BookingTeaser';
import CanvasSequence from './components/CanvasSequence';

function App() {
  return (
    <div className="relative w-full selection:bg-lavender selection:text-white">
      <NavBar />
      <main>
        <Hero />
        <div className="relative z-20 bg-base-cream rounded-t-[3rem] shadow-2xl">
          <ServicesGrid />
          
          <div className="relative w-full overflow-hidden">
            <CanvasSequence folderName="image_sequence_2" frameCount={83} />
            <BookingTeaser />
            <footer className="relative z-10 border-t border-white/10 text-center py-8">
              <p className="text-white/80 font-sans text-sm">
                &copy; {new Date().getFullYear()} NaturaSpa. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
