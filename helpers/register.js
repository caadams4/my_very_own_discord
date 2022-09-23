let firebase_object_here;

export function create_user(email, username, p1, p2, firebase_object) {
  //if (check_user_already_exists(username) == true || check_passwords_match(p1, p2) == false) {
  //  return;
  //}
  let uid = create_user_in_database(username, email, p1, firebase_object);
  console.log(uid);
  return uid;
}

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
    return false;
  }
};

let check_passwords_match = function (password1, password2) {
  if (password1 != password2) {
    alert("Passwords don't match");
    return false;
  }
  return true;
};

let create_user_in_database = function (
  username,
  email,
  password,
  firebase_object
) {
  console.log(firebase_object.fbauth);
  console.log(firebase_object.auth);
  console.log(email);
  console.log(password);
  firebase_object.fbauth
    .createUserWithEmailAndPassword(firebase_object.auth, email, password)
    .then((somedata) => {
      console.log(firebase_object.auth);
      console.log(firebase_object.fbauth);
      let uid = somedata.user.uid;
      let currentServer = "General";
      let newUser = {
        roles: {
          user: true,
          admin: false,
        },
        name: username,
        email: email,
        lastActive: new Date().getTime(),
        server: currentServer,
      };
      let newUserRef = firebase_object.rtdb.ref(
        firebase_object.db,
        `/users/${uid}/`
      );
      firebase_object.rtdb.set(newUserRef, newUser);
      let user = { username: username };
      let addUserRef = firebase_object.rtdb.ref(
        firebase_object.db,
        `/chatServers/General/members/${uid}`
      );
      firebase_object.rtdb.set(addUserRef, user);

      // add to user group
      let user_group_ref = firebase_object.rtdb.ref(
        firebase_object.db,
        `/groups/users/${uid}`
      );
      let user_group = {
        username,
      };
      firebase_object.rtdb.set(user_group_ref, user_group);
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
      console.log(errorCode);
      console.log(errorMessage);
    });
};
