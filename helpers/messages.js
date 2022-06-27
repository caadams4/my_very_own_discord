function send_message(username, message, current_server, firebase_object) {
  let messageRef = firebase_object.rtdb.child(firebase_object.titleRef,`chatServers/${current_server}/messages/`);
  console.log(current_server)
  let time = Date().valueOf();
  let time_arr = time.split(" ",5);
  let time_parse = time_arr[1] + " " + time_arr[2] + ", " + time_arr[3] + " " + time_arr[4];
    let newMessage = {
      "message" : message,
      "senderName" : username,
      "senderID" : firebase_object.auth.currentUser.uid,
      "timeStamp" : time_parse,
      "edited" : false 
      
    }
    console.log(newMessage)
  firebase_object.rtdb.push(messageRef, newMessage)
}

export { send_message };

