import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDk7lGvPFfWl427llQStiQyF3qbkItfHQA",
  authDomain: "cafe365-62590.firebaseapp.com",
  projectId: "cafe365-62590",
  storageBucket: "cafe365-62590.appspot.com",
  messagingSenderId: "213565230742",
  appId: "1:213565230742:web:b38265f2e03238a342fcb7",
  measurementId: "G-2R4E62DMB2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);


//sign in with username and pwd using firebase
export const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Login successfully!", {
      position: "bottom-right",
    });
  } catch (err) {
    console.error(err);
    // alert(err.message);
    
    toast.error("Invalid email or password!", {
      position: "bottom-right",
    });
  }
};

//sign out
export const logout = () => {
  signOut(auth);
  
  toast.success("Logged out successfully!", {
    position: "bottom-right",
  });
};
