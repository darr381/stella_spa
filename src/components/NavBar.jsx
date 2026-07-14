import React, { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-base-cream/80 backdrop-blur-md shadow-sm py-4' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className={`w-6 h-6 transition-colors ${scrolled ? 'text-nature-green' : 'text-white'}`} />
          <span className={`font-serif text-2xl font-semibold tracking-wide transition-colors ${scrolled ? 'text-nature-green' : 'text-white'}`}>
            NaturaSpa
          </span>
        </div>
        
        <ul className={`hidden md:flex gap-8 font-sans text-sm font-medium transition-colors ${scrolled ? 'text-nature-green' : 'text-white'}`}>
          {['Home', 'Services', 'About', 'Testimonials'].map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`} className="hover:text-lavender transition-colors">
                {link}
              </a>
            </li>
          ))}
        </ul>

        <button className={`hidden md:block px-6 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 ${
          scrolled 
            ? 'bg-nature-green text-white hover:bg-nature-greenLight' 
            : 'bg-white text-nature-green hover:bg-lavender hover:text-white'
        }`}>
          Book Now
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
