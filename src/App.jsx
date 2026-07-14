import React from 'react';
import CanvasSequence from './components/CanvasSequence';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import ServicesGrid from './components/ServicesGrid';
import BookingTeaser from './components/BookingTeaser';

function App() {
  return (
    <div className="relative w-full selection:bg-lavender selection:text-white">
      <CanvasSequence />
      <NavBar />
      <main>
        <Hero />
        <div className="relative z-20 bg-base-cream rounded-t-[3rem] overflow-hidden shadow-2xl">
          <ServicesGrid />
          <BookingTeaser />
          <footer className="bg-nature-green border-t border-white/10 text-center py-8">
            <p className="text-white/60 font-sans text-sm">
              &copy; {new Date().getFullYear()} NaturaSpa. All rights reserved.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
