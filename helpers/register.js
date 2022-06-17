import * as firebase from '../firebase.js';

export function create_user (email,username,p1,p2,fb) {
  //if (check_user_already_exists(username) == true || check_passwords_match(p1, p2) == false) {
  //  return;
  //}
  console.log(p1);
  console.log(p2);
  let uid = create_user_in_database(username, email, p1,fb);
  return uid;
};


let check_user_already_exists = function (username) {
  let userAlreadyExists;
  /*existingUsers.forEach(user => {
    if (username === user.username) {
      userAlreadyExists = true;
    }
  })*/
  if (userAlreadyExists === true) {
    alert("User already exists");
    return true;
  } else {
    return false
  }
};

let check_passwords_match = function (password1, password2) {
  if (password1 != password2) {
    alert("Passwords don't match");
    return false;
  }
  return true;
};

let create_user_in_database = function (username,email, password,fb) {
  console.log(fb.fbauth)
  console.log(fb.auth)
    console.log(email)
    console.log(password)
  fb.fbauth.createUserWithEmailAndPassword(fb.auth, email, password).then(somedata => {
    console.log(fb.auth);
    console.log(fb.fbauth);
    let uid = somedata.user.uid
    let currentServer = "General Chat";
    let currentChannel = "general";
    let newUser = {
      roles: {
        "user": true,
        "admin": false
      },
      name: username,
      email: email,
      lastActive: new Date().getTime(),
      server: currentServer,
      channel: currentChannel
    }
    //let messageRef = fb.rtdb.child(fb.titleRef, `chatServers/-MmKuzfOiBRFV6EHOiWW/members/`);
    //fb.rtdb.push(messageRef, { "uid": uid, "username": username })
    let newUserRef = fb.rtdb.ref(fb.db, `/users/${uid}/`)
    fb.rtdb.set(newUserRef, newUser);
    return uid;
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error)
    console.log(errorCode);
    console.log(errorMessage);
  });
  //renderServers(currentServer);
  //renderChannels(currentChannel);
  //renderUsersInServer(currentServer);
  //renderMessages(uid);
  //renderUsers();
};