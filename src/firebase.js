import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgBjQIQNUoVG_z77UMm8UcXARr3tqZVoU",
  authDomain: "stellahairsalon-bf673.firebaseapp.com",
  projectId: "stellahairsalon-bf673",
  storageBucket: "stellahairsalon-bf673.firebasestorage.app",
  messagingSenderId: "930859980508",
  appId: "1:930859980508:web:890b20eb167acc35bb4619",
  measurementId: "G-6GNQY8K7KJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Use initializeFirestore to force long polling and prevent 1-2 minute WebSocket stall on mobile cellular networks
export const db = initializeFirestore(app, { 
  experimentalForceLongPolling: true 
});
