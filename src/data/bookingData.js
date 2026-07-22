export const therapists = [
  { 
    id: 'aria', 
    name: 'Aria Green', 
    specialty: 'Head Spa & Reflexology', 
    rating: 5.0, 
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
  vip1a: {
    id: 'vip1a',
    name: 'VIP 1A',
    price: 88,
    duration: 65,
    included: ['Head Spa', 'Head Massage', 'Organic Shampoo'],
    addOns: []
  },
  vip1b: {
    id: 'vip1b',
    name: 'VIP 1B',
    price: 88,
    duration: 65,
    included: ['Head Spa', 'Head Massage', 'Face Gua Sha', 'Organic Shampoo'],
    addOns: []
  },
  vip1c: {
    id: 'vip1c',
    name: 'VIP 1C',
    price: 88,
    duration: 65,
    included: ['Head Spa', 'Head Massage', 'Neck & Shoulder Massage', 'Organic Shampoo'],
    addOns: []
  },
  vip1d: {
    id: 'vip1d',
    name: 'VIP 1D',
    price: 98,
    duration: 70,
    included: ['Head Spa', 'Keratin Hair Treatment'],
    addOns: []
  },
  vip2: {
    id: 'vip2',
    name: 'VIP 2',
    price: 118,
    duration: 90,
    included: ['Head Spa', 'Face Massage', 'Neck & Shoulder Massage'],
    addOns: []
  },
  vip3: {
    id: 'vip3',
    name: 'VIP 3',
    price: 148,
    duration: 110,
    included: ['Head Spa', 'Face Massage', 'Neck & Shoulder Massage', 'Face Gua Sha', 'Ears Candling'],
    addOns: []
  },
  basic_aqua: {
    id: 'basic_aqua',
    name: 'Basic Aqua Head Therapy Spa',
    price: 48,
    duration: 45,
    included: [
      'Essential oil relaxation', 'Head acupoint', 'Acupressure techniques', 
      'Hot essential oil scalp massage', 'Herbal cleanse', 'Twice therapeutic hair wash', 
      'Towel neck stretch', 'Signature Water Head Spa', 'Detox', 'Hair blow dry', 'Head massage'
    ],
    addOns: []
  },
  vip1_aqua: {
    id: 'vip1_aqua',
    name: 'VIP 1: Aqua Head Therapy Spa',
    price: 88,
    duration: 65,
    included: [
      'Essential oil relaxation', 'Head acupoint', 'Acupressure techniques', 
      'Hot essential oil scalp massage', 'Herbal cleanse', 'Korea face mask', 
      'Twice therapeutic hair wash', 'Herbal nourishing', 'Towel neck stretch', 
      'Signature Water Head Spa', 'Detox', 'Hair blow dry massage'
    ],
    addOns: [
      { id: 'add_facial', name: 'Facial therapy massage', price: 40, duration: 0 }
    ]
  },
  vip2_aqua: {
    id: 'vip2_aqua',
    name: 'VIP 2: Aqua Head Therapy Spa',
    price: 118,
    duration: 90,
    included: [
      'Essential oil relaxation', 'Head acupoint', 'Acupressure techniques', 
      'Hot essential oil scalp massage', 'Herbal cleanse', 'Korea face mask', 
      'Twice therapeutic hair wash', 'Herbal nourishing', 'Towel neck stretch', 
      'Signature Water Head Spa', 'Detox', 'Hair blow dry', 'Ear massage'
    ],
    addOns: [
      { id: 'add_facial', name: 'Facial therapy massage', price: 40, duration: 0 },
      { id: 'add_scalp_gua_sha', name: 'Scalp Gua Sha', price: 40, duration: 0 }
    ]
  },
  vip3_aqua: {
    id: 'vip3_aqua',
    name: 'VIP 3: Aqua Head Therapy Spa',
    price: 148,
    duration: 110,
    included: [
      'Essential oil relaxation', 'Head acupoint', 'Acupressure techniques', 
      'Hot essential oil scalp massage', 'Herbal cleanse', 'Korea face mask', 
      'Twice therapeutic hair wash', 'Herbal nourishing', 'Towel neck stretch', 
      'Signature Water Head Spa', 'Detox', 'Hair blow dry', 'Scalp Gua Sha', 
      'Neck & shoulder massage', 'Claw scalp massage', 'Peacock feather relaxation'
    ],
    addOns: [
      { id: 'add_facial', name: 'Facial therapy massage', price: 40, duration: 0 },
      { id: 'add_ear_candling', name: 'Ear massage candling', price: 35, duration: 0 },
      { id: 'add_facial_gua_sha', name: 'Facial Gua Sha', price: 48, duration: 0 },
      { id: 'add_neck_steam', name: 'Neck & shoulder herbal steam', price: 48, duration: 0 },
      { id: 'add_foot_detox', name: 'Herbal foot detox spa', price: 28, duration: 0 }
    ]
  }
};
