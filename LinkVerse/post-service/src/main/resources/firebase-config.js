import firebase from 'firebase/app';
import 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBbuKpZk5J5RwSQInlaHsJGeelGciN1oqQ",
    authDomain: "linkverse-5f4c3.firebaseapp.com",
    projectId: "linkverse-5f4c3",
    storageBucket: "linkverse-5f4c3.firebasestorage.app",
    messagingSenderId: "21129940658",
    appId: "1:21129940658:web:c6b6be857aae25fde4c3ab",
    measurementId: "G-X8QGKS8ZMM"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();