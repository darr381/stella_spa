import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const BookingTeaser = () => {
  return (
    <section className="relative py-32 px-6 z-10">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-lavender opacity-20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-nature-greenLight opacity-30 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl text-white font-serif mb-6 drop-shadow-md">
            Ready to Find Your Peace?
          </h2>
          <p className="text-white/90 font-sans text-lg mb-10 max-w-xl mx-auto drop-shadow-md">
            Secure your moment of tranquility. Our botanical sanctuary awaits to restore your natural harmony with the calming essence of lavender.
          </p>
          <button className="bg-white text-nature-green hover:bg-lavender hover:text-white px-10 py-4 rounded-full font-sans font-medium text-lg transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(156,140,185,0.5)] flex items-center justify-center mx-auto gap-3">
            <Calendar className="w-5 h-5" />
            Book Your Appointment
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingTeaser;
