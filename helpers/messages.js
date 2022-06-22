function send_message(username, message, current_server, firebase_object) {
    let messageRef = firebase_object.rtdb.child(firebase_object.titleRef,`chatServers/${current_server}/messages/`);
    let time = Date().valueOf();
      let newMessage = {
        "message" : message,
        "senderName" : username,
        "senderID" : firebase_object.auth.currentUser.uid,
        "timeStamp" : time,
        "edited" : false 
        
      }
    firebase_object.rtdb.push(messageRef, newMessage)
  }
  
  export { send_message };
  
  