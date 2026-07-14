import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Hair Cut',
    description: 'Botanical cuts and conditioning treatments infused with herbal essences.',
    image: 'https://images.unsplash.com/photo-1560869713-da86a9ec0744?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Head Spa',
    description: 'Deeply relaxing Ayurvedic scalp massages featuring warm, essential oils.',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop', 
  },
  {
    title: 'Nail Spa',
    description: 'Nourishing manicures and pedicures utilizing organic lavender scrubs.',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop', 
  },
  {
    title: 'Foot Spa',
    description: 'Detoxifying forest-clay foot baths and reflexology sessions.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop', 
  },
  {
    title: 'Face Spa',
    description: 'Holistic, vitamin-rich facials designed to bring out your natural glow.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop', 
  },
  {
    title: 'Aromatherapy',
    description: 'Breathe in the pure essence of lavender fields and eucalyptus forests.',
    image: 'https://images.unsplash.com/photo-1608248593842-83b3e2a22530?q=80&w=800&auto=format&fit=crop', 
  }
];

const ServicesGrid = () => {
  return (
    <section id="services" className="relative bg-base-cream py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl text-nature-green mb-6">The Botanical Menu</h2>
          <div className="w-24 h-1 bg-lavender mx-auto rounded-full mb-6"></div>
          <p className="text-nature-greenLight font-sans max-w-2xl mx-auto text-lg">
            Experience our meticulously crafted treatments, blending modern luxury with the ancient healing power of nature and fields of lavender.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-lavender-light hover:bg-lavender/5"
            >
              <div className="overflow-hidden h-64">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl text-nature-green mb-3">{service.title}</h3>
                <p className="text-nature-greenLight font-sans leading-relaxed text-sm md:text-base">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
