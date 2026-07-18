export const therapists = [
  { 
    id: 'aria', 
    name: 'Aria Green', 
    specialty: 'Head Spa & Reflexology', 
    rating: 5.0, 
    // Using high quality Unsplash placeholders for avatars
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' 
  },
  { 
    id: 'elena', 
    name: 'Elena Lavender', 
    specialty: 'Facials & Nails', 
    rating: 4.9, 
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&auto=format&fit=crop' 
  },
  { 
    id: 'marcus', 
    name: 'Marcus Pine', 
    specialty: 'Hair Cuts & Styling', 
    rating: 4.8, 
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' 
  },
  { 
    id: 'any', 
    name: 'Any Available Therapist', 
    specialty: 'First Available', 
    rating: null, 
    avatar: null 
  }
];

export const services = {
  headSpa: {
    id: 'headSpa',
    name: 'Head Spa',
    options: [
      { id: 'h_45', name: '45 min Session', price: 95, duration: 45 },
      { id: 'h_90', name: '90 min Session', price: 165, duration: 90 },
    ]
  },
  nailSpa: {
    id: 'nailSpa',
    name: 'Nail Spa',
    options: [
      { id: 'n_45', name: '45 min Manicure', price: 65, duration: 45 },
      { id: 'n_90', name: '90 min Mani-Pedi', price: 110, duration: 90 },
    ]
  },
  footSpa: {
    id: 'footSpa',
    name: 'Foot Spa',
    options: [
      { id: 'f_30', name: '30 min Reflexology', price: 55, duration: 30 },
      { id: 'f_60', name: '60 min Full Bath', price: 95, duration: 60 },
    ]
  },
  facialSpa: {
    id: 'facialSpa',
    name: 'Facial Spa',
    options: [
      { id: 'fa_30', name: '30 min Express Glow', price: 80, duration: 30 },
      { id: 'fa_60', name: '60 min Holistic Facial', price: 140, duration: 60 },
    ]
  },
  hairCut: {
    id: 'hairCut',
    name: 'Hair Cut',
    options: [
      { id: 'hc_m', name: 'Male Hair Cut', price: 55, duration: 30 },
      { 
        id: 'hc_f', 
        name: 'Female Hair Cut', 
        price: 85, 
        duration: 45, 
        addOns: [
          { id: 'add_dye', name: 'Add Dyeing', price: 75, duration: 45 },
          { id: 'add_perm', name: 'Add Perming', price: 95, duration: 60 },
          { id: 'add_style', name: 'Add Styling', price: 35, duration: 20 },
          { id: 'add_curl', name: 'Add Curling', price: 30, duration: 15 },
        ]
      }
    ]
  }
};
