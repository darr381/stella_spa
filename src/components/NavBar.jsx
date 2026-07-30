import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const NavBar = ({ onOpenLogin, onOpenStaffLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBookClick = (e) => {
    if (e) e.preventDefault();
    if (user && user.phone) {
      navigate('/my-appointments');
    } else {
      if (onOpenLogin) onOpenLogin();
    }
  };

  const handleMobileBookClick = (e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    if (user && user.phone) {
      navigate('/my-appointments');
    } else {
      if (onOpenLogin) onOpenLogin();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [mobileMenuOpen]);

  const navLinks = [
    { key: 'nav.home', href: 'home' }, 
    { key: 'nav.services', href: 'services' }, 
    { key: 'nav.about', href: 'about' }, 
    { key: 'nav.testimonials', href: 'testimonials' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled && !mobileMenuOpen
          ? 'bg-base-cream/95 backdrop-blur-md shadow-sm py-4' 
          : mobileMenuOpen
            ? 'bg-transparent py-4'
            : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className={`w-6 h-6 transition-colors ${scrolled && !mobileMenuOpen ? 'text-nature-green' : 'text-white'}`} />
            <span className={`font-serif text-2xl font-semibold tracking-wide transition-colors ${scrolled && !mobileMenuOpen ? 'text-nature-green' : 'text-white'}`}>
              NaturaSpa
            </span>
          </div>
          
          {/* Desktop Menu */}
          <ul className={`hidden md:flex items-center gap-8 font-sans text-sm font-medium transition-colors ${scrolled ? 'text-nature-green' : 'text-white'}`}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={`#${link.href}`} className="hover:text-lavender transition-colors">
                  {t(link.key)}
                </a>
              </li>
            ))}
            <li>
              <button 
                onClick={onOpenStaffLogin}
                className="hover:text-lavender transition-colors flex items-center font-medium"
              >
                {t('nav.staffLogin')}
              </button>
            </li>
          </ul>

          {user && user.phone ? (
            <div className="hidden md:flex items-center gap-4">
              <span className={`font-sans text-sm font-medium ${scrolled ? 'text-nature-green' : 'text-white'}`}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button 
                type="button" 
                onClick={() => { 
                  localStorage.removeItem('naturaSpaUser'); 
                  window.location.reload(); 
                }} 
                className={`px-4 py-2 rounded-full font-sans text-sm font-medium border transition-all duration-300 ${
                  scrolled 
                    ? 'border-nature-green text-nature-green hover:bg-nature-green/10' 
                    : 'border-white text-white hover:bg-white/10'
                }`}
              >
                {t('nav.logout')}
              </button>
              <button type="button" onClick={handleBookClick} className={`px-6 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 ${
                scrolled 
                  ? 'bg-nature-green text-white hover:bg-nature-greenLight' 
                  : 'bg-white text-nature-green hover:bg-lavender hover:text-white'
              }`}>
                {t('nav.bookNow')}
              </button>
            </div>
          ) : (
            <button type="button" onClick={handleBookClick} className={`hidden md:block px-6 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 ${
              scrolled 
                ? 'bg-nature-green text-white hover:bg-nature-greenLight' 
                : 'bg-white text-nature-green hover:bg-lavender hover:text-white'
            }`}>
              {t('nav.bookNow')}
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 z-50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <Menu className={`w-7 h-7 ${scrolled ? 'text-nature-green' : 'text-white'}`} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 w-full h-[100dvh] bg-nature-green/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center pt-10 px-6"
          >
            <ul className="flex flex-col items-center gap-10 font-serif text-3xl text-white">
              {navLinks.map((link, idx) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <a 
                    href={`#${link.href}`} 
                    className="hover:text-lavender transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(link.key)}
                  </a>
                </motion.li>
              ))}
              <motion.li 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.05 }}
              >
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenStaffLogin) onOpenStaffLogin();
                  }}
                  className="hover:text-lavender transition-colors"
                >
                  {t('nav.staffLogin')}
                </button>
              </motion.li>
            </ul>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button 
                onClick={handleMobileBookClick}
                className="mt-14 block bg-white text-nature-green hover:bg-lavender hover:text-white px-12 py-4 rounded-full font-sans text-lg font-medium shadow-lg transition-all active:scale-95"
              >
                {t('nav.bookNow')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
