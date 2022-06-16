import * as firebase from '../../firebase';

let create_user = function (evt) {
    let email = $("#regemail").val();
    let username = $("#regdisplay").val();
    let p1 = $("#regpass1").val();
    let p2 = $("#regpass2").val();
    if (check_user_already_exists(username) == true || check_passwords_match(p1,p2) == false) {
        return;
    }
    create_user_in_database(username,email,p1);
};
  

let check_user_already_exists = function (username) {
    let userAlreadyExists;
    existingUsers.forEach(user=>{
      if (username === user.username) {
        userAlreadyExists = true;
      }
    })
    if (userAlreadyExists === true) {
        alert("User already exists");
        return true;
    } else {
        return false
    }
};

let check_passwords_match = function (password1,password2) {
    if (password1 != password2){
        alert("Passwords don't match");
        return false;
    }
    return true;
};

let create_user_in_database = function (username,password) {
    fbauth.createUserWithEmailAndPassword(auth, email, p1).then(somedata=>{
        uid = somedata.user.uid
        currentServer = "General Chat";
        currentChannel = "general";
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
        let messageRef = rtdb.child(titleRef,`chatServers/-MmKuzfOiBRFV6EHOiWW/members/`);
        rtdb.push(messageRef,{"uid": uid,"username":username})
        let newUserRef = rtdb.ref(db,`/users/${uid}/`)
        rtdb.set(newUserRef,newUser);
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
      currentServer = "server1";
      currentChannel = "general";
      //renderServers(currentServer);
      //renderChannels(currentChannel);
      //renderUsersInServer(currentServer);
      //renderMessages(uid);
      //renderUsers();
      $("#login_register_module").css({"display":"none"});
      $("#chat_module").css({"display":"contents"});
};