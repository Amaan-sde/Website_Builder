import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD0qjMAogy9-sEN12yvikBUgADT-pFwqhE',
    authDomain: 'websitebuilder-ee244.firebaseapp.com',
    projectId: 'websitebuilder-ee244',
    storageBucket: 'websitebuilder-ee244.firebasestorage.app',
    messagingSenderId: '868268212439',
    appId: '1:868268212439:web:f2b7a962b6f3e2348c3092'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };