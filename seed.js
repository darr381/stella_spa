import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgBjQIQNUoVG_z77UMm8UcXARr3tqZVoU",
  authDomain: "stellahairsalon-bf673.firebaseapp.com",
  projectId: "stellahairsalon-bf673",
  storageBucket: "stellahairsalon-bf673.firebasestorage.app",
  messagingSenderId: "930859980508",
  appId: "1:930859980508:web:890b20eb167acc35bb4619",
  measurementId: "G-6GNQY8K7KJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  try {
    const phone = "91234567";
    const employeeData = {
      name: "Jane Doe",
      password: "password123", // Keep it simple for the demo
      profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
      workingHours: {
        start: "10:00",
        end: "22:00",
        lunchStart: "12:00",
        lunchEnd: "13:00"
      },
      onLeave: {
        isOut: false,
        returnDate: null
      }
    };
    
    await setDoc(doc(db, 'employees', phone), employeeData);
    console.log("Successfully seeded employee data for phone:", phone);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
