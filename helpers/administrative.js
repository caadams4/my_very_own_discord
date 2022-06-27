function add_user_to_server(username, uid, servername, firebase_object) {
    let user = { username: username };
    let addUserRef = firebase_object.rtdb.ref(
      firebase_object.db,
      `/chatServers/General/members/${uid}`
    );
    firebase_object.rtdb.set(addUserRef, user).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
      console.log(errorCode);
      console.log(errorMessage);
    });
  }
  
  function add_server(firebase_object, username, servername) {
    console.log(firebase_object.auth.currentUser.uid);
    let user = { username: username };
    let time = Date().valueOf();
    let new_server = {
      members: {
        [firebase_object.auth.currentUser.uid]: {
          username: username,
        },
      },
      messages: {
        123: {
          edited: false,
          message: `Welcome to ${servername}`,
          senderID: "R2-D2",
          senderName: "R2-D2",
          timeStamp: time,
        },
      },
    };
    let addServerRef = firebase_object.rtdb.ref(
      firebase_object.db,
      `/chatServers/${servername}/`
    );
    console.log(new_server);
    firebase_object.rtdb.set(addServerRef, new_server).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
      console.log(errorCode);
      console.log(errorMessage);
    });
  }
  
  function add_user(firebase_object, user_info, username_2_add) {
    let server = user_info.server;
    firebase_object.rtdb.get(firebase_object.userRef).then((data) => {
      let user_data = data.val();
      let uids = Object.keys(user_data);
      let success = false;
      uids.map((uid) => {
        if (username_2_add === user_data[uid].name) {
          success = true;
          let user_object = {
              username: username_2_add,
          };
          console.log(user_object)
          let addUser2ServerRef = firebase_object.rtdb.ref(
            firebase_object.db,
            `/chatServers/${server}/members/${uid}`
          );
          firebase_object.rtdb
            .set(addUser2ServerRef, user_object)
            .catch(function (error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log(error);
              console.log(errorCode);
              console.log(errorMessage);
            });
          return user_object;
        } else {
          return;
        }
      });
      console.log(success)
      if (success === false) {
        alert("No user with that name")
      }
    });
  }
  
  export { add_user, add_server };
  