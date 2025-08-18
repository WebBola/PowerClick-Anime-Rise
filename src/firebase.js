import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxTWD2_7vYNFLS62lV4OQjQAzJX72C060",
  authDomain: "powerclick-anime-rise.firebaseapp.com",
  projectId: "powerclick-anime-rise",
  storageBucket: "powerclick-anime-rise.firebasestorage.app",
  messagingSenderId: "734110171037",
  appId: "1:734110171037:web:2449e518af3671efb57974",
  measurementId: "G-6644165K12"
};

const app = initializeApp(firebaseConfig);

// Firestore bazani ulaymiz
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
// db ni boshqa fayllarda ishlatish uchun eksport qilamiz
export { db };