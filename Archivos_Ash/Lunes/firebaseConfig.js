// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Importa Realtime Database

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMF1HJxCBRHlsEd_BU90EMSXVgilGlTSw",
  authDomain: "eyesaviors.firebaseapp.com",
  databaseURL: "https://eyesaviors-default-rtdb.firebaseio.com", // Asegúrate de incluir esta URL
  projectId: "eyesaviors",
  storageBucket: "eyesaviors.appspot.com",
  messagingSenderId: "1064358481342",
  appId: "1:1064358481342:web:cd56d8e23e82d128083def",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore, Storage, Auth y Database
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const database = getDatabase(app); // Agrega la inicialización de la Realtime Database

export { db, storage, auth, database };
