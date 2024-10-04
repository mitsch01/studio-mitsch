// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "mitsch-website.firebaseapp.com",
  projectId: "mitsch-website",
  storageBucket: "mitsch-website.appspot.com",
  messagingSenderId: "240593043883",
  appId: "1:240593043883:web:b323c1f176c4dc662d92ee",
  measurementId: "G-P47X78ELLB"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
