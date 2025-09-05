// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

const firebaseConfigString = import.meta.env.VITE_FIREBASE_CONFIG

const firebaseConfig = JSON.parse(firebaseConfigString);


// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firebase Authentication y exporta la instancia para usarla en otros componentes
export const auth = getAuth(app);