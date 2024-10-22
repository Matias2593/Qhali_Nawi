// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

//config de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMF1HJxCBRHlsEd_BU90EMSXVgilGlTSw",
  authDomain: "eyesaviors.firebaseapp.com",
  projectId: "eyesaviors",
  storageBucket: "eyesaviors.appspot.com",
  messagingSenderId: "1064358481342",
  appId: "1:1064358481342:web:cd56d8e23e82d128083def",
};

//inicializa Firebase
const app = initializeApp(firebaseConfig);

//inicializa Firestore, Storage y Auth
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
