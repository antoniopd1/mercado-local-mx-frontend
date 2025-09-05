// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

const firebaseConfig = import.meta.env.VITE_FIREBASE_CONFIG


// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firebase Authentication y exporta la instancia para usarla en otros componentes
export const auth = getAuth(app);