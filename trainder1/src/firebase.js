import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyAU1X0QK3_aF-J6_g_KBtVs5gh3wXTPGYI",
    authDomain: "fir-b9dbd.firebaseapp.com",
    projectId: "fir-b9dbd",
    storageBucket: "fir-b9dbd.appspot.com",
    messagingSenderId: "243504793880",
    appId: "1:243504793880:web:0146fa89c7dc2f3c65b66d",
    measurementId: "G-JNBVT0RB4K"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export const fb = firebase