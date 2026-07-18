import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CanvasSequence from './CanvasSequence';

const Hero = ({ onOpenLogin }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookClick = (e) => {
    if (e) e.preventDefault();
    if (user && user.phone) {
      navigate('/book');
    } else {
      if (onOpenLogin) onOpenLogin();
    }
  };

  return (
    <section id="home" className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-6 text-center z-10 overflow-hidden">
      <CanvasSequence folderName="image_sequence_1" frameCount={75} />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-4xl relative z-10"
      >
        <h1 className="font-serif text-5xl md:text-7xl text-white font-bold leading-tight drop-shadow-lg mb-6">
          Reconnect with Nature.<br />
          <span className="italic font-light">Restore Your Soul.</span>
        </h1>
        <p className="font-sans text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto mb-10 drop-shadow-md">
          A luxury botanical sanctuary designed to heal your mind, body, and spirit.
        </p>
        <button onClick={handleBookClick} className="bg-lavender hover:bg-lavender-light text-white px-8 py-4 rounded-full font-sans tracking-wide shadow-[0_0_20px_rgba(156,140,185,0.5)] transition-all hover:scale-105 active:scale-95 flex w-fit items-center justify-center mx-auto gap-2">
          Explore Our Sanctuary
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;
