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
import {
  render_servers,
  render_messages,
  render_users,
  get_user_server,
  database_listen_for_change,
  build_user_info,
} from "./helpers/render_app_data.js";
import { send_message } from "./helpers/messages.js";
import { add_user, add_server } from "./helpers/administrative.js";

$(document).ready(function () {
  window.onload = () => {
    if (auth.currentUser === null) {
      $(".signin_parent").css({ display: "contents" });
    }
  };

  const app = initializeApp(firebaseConfig);
  let app_data;
  let auth = fbauth.getAuth(app);
  let db = rtdb.getDatabase(app);
  let titleRef = rtdb.ref(db, "/");
  let chatRef = rtdb.child(titleRef, "chatServers/");
  let userRef = rtdb.child(titleRef, "users/");
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
  let user_info;

  fbauth.onAuthStateChanged(auth, (user) => {
    if (user) {
      user_info = build_user_info(firebase_object);
      database_listen_for_change(firebase_object, user_info);
      console.log(user_info);
      $(".register_parent").css({ display: "none" });
      $(".signin_parent").css({ display: "none" });
      let myUserRef = rtdb.ref(db, `/users/${user_info.uid}`);
      username = rtdb.get(myUserRef).then((ss) => {
        return ss.val().name;
      });

      $(".dashboard_parent").css({ display: "contents" });
    } else {
      user_info = {
        uid: "",
        username: "",
        server: "",
        role: "",
      };
      $(".admin_tools").css({ display: "none" });
      $(".dashboard_parent").css({ display: "none" });
      $(".register_parent").css({ display: "none" });
      $(".signin_parent").css({ display: "contents" });
    }
  });

  $("#switch_2_register").on("click", function () {
    $(".signin_parent").css({ display: "none" });
    $(".register_parent").css({ display: "contents" });
  });

  $("#switch_2_signin").on("click", function () {
    $(".register_parent").css({ display: "none" });
    $(".signin_parent").css({ display: "contents" });
  });

  $(".submit_btn").on("click", function () {
    email = $("#email_signin").val();
    $("#email_signin").empty();
    password = $("#password_signin").val();
    $("#password_signin").empty();
    sign_user_in(email, password, firebase_object);
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
    create_user(email, username, password, password2, firebase_object);
  });

  $(".signout").on("click", function () {
    fbauth.signOut(auth);
  });

  $("#add_serv_btn").on("click", function () {
    let servername = $("#add_serv").val();
    $("#add_serv").empty();
    add_server(firebase_object, user_info.username, servername);
  });

  $("#add_user_btn").on("click", function () {
    let username = $("#add_user_2_server").val();

    $("#add_user_2_server").empty();
    add_user(firebase_object, user_info, username);
  });

  $(".send").on("click", function () {
    let message = $(".message_input").val();
    $("#message_input").empty();
    send_message(
      user_info.username,
      message,
      user_info.server,
      firebase_object
    );
  });
});

// DASHBOARD @ https://codepen.io/abyeidengdit/pen/poaVGXG?editors=0010
