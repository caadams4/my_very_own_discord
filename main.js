import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import { firebaseConfig } from "./firebase.js";
import { create_user } from "./helpers/register.js";
import { sign_user_in } from "./helpers/signin.js";
import { render_servers, render_messages } from "./helpers/render_app_data.js";
import { send_message } from "./helpers/messages.js";

$(document).ready(function () {
  const app = initializeApp(firebaseConfig);
  let current_server = "General";
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
  };

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
    $("#email_signin").empty();
    password = $("#password_signin").val();
    $("#password_signin").empty();
    let uid = sign_user_in(email, password, firebase_object);
  });

  $(".register_btn").on("click", function () {
    email = $("#email_register").val();
    password = $("#password1_register").val();
    password2 = $("#password2_register").val();
    username = $("#username_register").val();
    $("#email_register").empty();
    $("#password1_register").empty();
    $("#password2_register").empty();
    $("#username_register").empty();
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

  $(".send").on("click", function () {
    console.log("sending message");
    let message = $(".message_input").val();
    $("#message_input").empty();
    send_message(username, message, current_server, firebase_object);
  });

  fbauth.onAuthStateChanged(auth, (user) => {
    if (user) {
      let uid = auth.currentUser.uid;
      rtdb.onValue(chatRef, (server_data) => {
        render_servers(firebase_object, server_data, current_server);
        render_messages(firebase_object, server_data, current_server);
      });
      $(".register_parent").css({ display: "none" });
      $(".signin_parent").css({ display: "none" });
      let myUserRef = rtdb.ref(db, `/users/${uid}`);
      rtdb.get(myUserRef).then((ss) => {
        username = ss.val().name;
      });
      $(".dashboard_parent").css({ display: "contents" });
      console.log(auth.currentUser.uid);
    } else {
      let uid;
      $(".dashboard_parent").css({ display: "none" });
      $(".register_parent").css({ display: "none" });
      $(".signin_parent").css({ display: "contents" });
    }
  });

  rtdb.onValue(chatRef, (server_data) => {
    render_servers(firebase_object, server_data, current_server);
    render_messages(firebase_object, server_data, current_server);
  });
});

// DASHBOARD @ https://codepen.io/abyeidengdit/pen/poaVGXG?editors=0010
