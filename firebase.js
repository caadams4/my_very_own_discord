import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from"https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAorNUL61m4aX1f_zR_d8Xdsbj2TfVATZs",
    authDomain: "websec-auth-3225b.firebaseapp.com",
    databaseURL: "https://websec-auth-3225b-default-rtdb.firebaseio.com",
    projectId: "websec-auth-3225b",
    storageBucket: "websec-auth-3225b.appspot.com",
    messagingSenderId: "263553145282",
    appId: "1:263553145282:web:e5791cb7ab6896c1aede5b",
    measurementId: "G-LZ6HRBZQSR"
  };

const app = initializeApp(firebaseConfig);
let auth = fbauth.getAuth(app);
let db = rtdb.getDatabase(app);
let titleRef = rtdb.ref(db, "/");
let chatRef = rtdb.child(titleRef,"chatServers/");
let userRef = rtdb.child(titleRef,"users/");

export {app,auth,db,titleRef,chatRef,userRef};