// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy7z_6ftI8rhF1N2wabrXDc9Nl71b-1uA",
  authDomain: "attendcbs.firebaseapp.com",
  projectId: "attendcbs",
  storageBucket: "attendcbs.appspot.com",
  messagingSenderId: "709310326398",
  appId: "1:709310326398:web:b61d5c8a90049b21a91a2f",
  measurementId: "G-HM4H4M03GY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;