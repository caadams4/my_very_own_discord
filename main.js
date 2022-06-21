import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import {getAuth,signOut,} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import { firebaseConfig } from "./firebase.js";
import { create_user } from "./helpers/register.js";
import { sign_user_in } from "./helpers/signin.js";

$(document).ready(function () {
  const app = initializeApp(firebaseConfig);
  let auth = fbauth.getAuth(app);
  let db = rtdb.getDatabase(app);
  let titleRef = rtdb.ref(db, "/");
  let chatRef = rtdb.child(titleRef, "chatServers/");
  let userRef = rtdb.child(titleRef, "users/");
  if (auth.currentUser) {
    let uid = auth.currentUser.uid;
  }
  let firebase_object = {
    app,
    auth,
    db,
    titleRef,
    chatRef,
    userRef,
    rtdb,
    fbauth,
  };
  let email, password, username, password2;
  
  window.onload = () => {
    if (auth.currentUser.uid === null) {
      $(".signin_parent").css({ display: "contents" });
    }
  }

  $("#switch_2_register").on("click", function () {
    $(".signin_parent").css({ display: "none" });
    $(".register_parent").css({ display: "contents" });
  });

  $("#switch_2_signin").on("click", function () {
    $(".register_parent").css({ display: "none" });
    $(".signin_parent").css({ display: "contents" });
  });

  $(".submit_btn").on("click", function () {
    console.log("bruh");
    email = $("#email_signin").val();
    password = $("#password_signin").val();
    let uid = sign_user_in(email, password, firebase_object);
    console.log(auth.uid);
  });

  $(".register_btn").on("click", function () {
    console.log(auth);
    console.log(fbauth);
    email = $("#email_register").val();
    password = $("#password1_register").val();
    password2 = $("#password2_register").val();
    username = $("#username_register").val();
    let uid = create_user(
      email,
      username,
      password,
      password2,
      firebase_object
    );
  });

  $(".signout").on("click", function () {
    fbauth.signOut(auth);
  });

  $(".showuid").on("click", function () {
    console.log(auth.currentUser.uid);
  });

  fbauth.onAuthStateChanged(auth, (user) => {
    if (user) {
      let uid = auth.currentUser.uid;
      $(".register_parent").css({ display: "none" });
      $(".signin_parent").css({ display: "none" });
      $(".dashboard_parent").css({ display: "contents" });
      console.log(auth.currentUser.uid);
    } else {
      let uid;
      $(".dashboard_parent").css({ display: "none" });
      $(".register_parent").css({ display: "none" });
      $(".signin_parent").css({ display: "contents" });
    }
  });
});


// DASHBOARD @ https://codepen.io/abyeidengdit/pen/poaVGXG?editors=0010