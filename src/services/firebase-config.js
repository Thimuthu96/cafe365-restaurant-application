import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { toast } from "react-toastify";

const firebaseConfig = {
  //-- firebase config removed because of security reasons
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
