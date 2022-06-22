export function create_new_server(firebase_object, serverName) {
  let myUserRef = firebase_object.rtdb.child(
    firebase_object.titleRef,
    `users/${firebase_object.auth.currentUser.uid}`
  );
  let servExists;
  firebase_object.existingServers.forEach((server) => {
    if (serverName === server.servName) {
      servExists = true;
    }
  });
  if (servExists === true) {
    alert("Server already exists");
    return;
  } else {
    firebase_object.rtdb.get(myUserRef).then((ss) => {
      let first_message = {
        edited: false,
        message: "beep - boop : Welcome to the new server!",
        senderID: "R2-D2",
        timeStamp: new Date().getTime(),
      };

      let uid = firebase_object.auth.currentUser.uid;
      let newServer = {
        [serverName]: {
          messages: null,
          members: {
            [uid]: {
              username: ss.val().name,
            },
          },
        },
      };

      let serverRef = firebase_object.rtdb.child(
        firebase_object.chatRef,
        `chatServers/${serverName}/messages`
      );

      firebase_object.rtdb.push(firebase_object.chatRef, newServer);
      firebase_object.rtdb.push(serverRef, first_message);
    });
  }
}
