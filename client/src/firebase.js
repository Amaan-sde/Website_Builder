// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "websitebuilder-ee244.firebaseapp.com",
    projectId: "websitebuilder-ee244",
    storageBucket: "websitebuilder-ee244.firebasestorage.app",
    messagingSenderId: "868268212439",
    appId: "1:868268212439:web:f2b7a962b6f3e2348c3092"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }