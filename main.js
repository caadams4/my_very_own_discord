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

$(document).ready(function () { // renders sign in page
  window.onload = () => {
    if (auth.currentUser === null) {
      $(".signin_parent").css({ display: "contents" });
    }
  };

 
  const app = initializeApp(firebaseConfig);
  let auth = fbauth.getAuth(app);
  let db = rtdb.getDatabase(app);
  let titleRef = rtdb.ref(db, "/");
  let chatRef = rtdb.child(titleRef, "chatServers/");
  let userRef = rtdb.child(titleRef, "users/");
  let firebase_object = { // create firebase auth object containing db path, user info, and db references.
    app,
    auth,
    db,
    titleRef,
    chatRef,
    userRef,
    rtdb,
    fbauth,
  };
  let email, password, username, password2; // used to create user object prior to database push
  let user_info; // will serve as user object

  fbauth.onAuthStateChanged(auth, (user) => {
    // listens for authentication state changes. renders pages appropriately
    if (user) { // if not signed in
      user_info = build_user_info(firebase_object);
      console.log(user_info)
      database_listen_for_change(firebase_object, user_info);
      $(".register_parent").css({ display: "none" });
      $(".signin_parent").css({ display: "none" });
      let myUserRef = rtdb.ref(db, `/users/${user_info.uid}`);
      username = rtdb.get(myUserRef).then((ss) => {
        return ss.val().name;
      });

      $(".dashboard_parent").css({ display: "contents" });
    } else { // if signed in
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

  $("#switch_2_register").on("click", function () { // controls switching from login page to register page
    $(".signin_parent").css({ display: "none" });
    $(".register_parent").css({ display: "contents" });
  });

  $("#switch_2_signin").on("click", function () { // controls switching from register page to login page
    $(".register_parent").css({ display: "none" });
    $(".signin_parent").css({ display: "contents" });
  });

  $(".submit_btn").on("click", function () { // submit login info
    email = $("#email_signin").val();
    $("#email_signin").empty();
    password = $("#password_signin").val();
    $("#password_signin").empty();
    sign_user_in(email, password, firebase_object);
  });

  $(".register_btn").on("click", function () { // sumbmit registration
    email = $("#email_register").val();
    password = $("#password1_register").val();
    password2 = $("#password2_register").val();
    username = $("#username_register").val();
    $("#email_register").val('');
    $("#password1_register").val('');
    $("#password2_register").val('');
    $("#username_register").val('');
    create_user(email, username, password, password2, firebase_object);
  });

  $(".signout").on("click", function () { // signs out user. goes back to login page
    fbauth.signOut(auth);
  });

  $("#add_serv_btn").on("click", function () { // for admins, can create new server
    let servername = $("#add_serv").val();
    add_server(firebase_object, user_info.username, servername);
    $("#add_serv").val('');
  });

  $("#add_user_btn").on("click", function () {// for admins, can add users to servers
    let username = $("#add_user_2_server").val();
    $("#add_user_2_server").val('');
    add_user(firebase_object, user_info, username);
  });

  $("#send").on("click", function () { // send a message to the server
    let message = $("#message_input").val();
    $("#message_input").val('');
    send_message(
      user_info.username,
      message,
      user_info.server,
      firebase_object
    );
  });
});
