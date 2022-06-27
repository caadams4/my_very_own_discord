function demote_to_pleb(username, userID, firebase_object_here) {
    let roleRef = firebase_object_here.rtdb.child(firebase_object_here.titleRef,`users/${userID}/roles/admin/`);
    firebase_object_here.rtdb.set(roleRef,false);
  }
  
  function kick_from_server(username, userID, current_server, firebase_object_here) {
    let memberRef = firebase_object_here.rtdb.child(firebase_object_here.titleRef,`chatServers/${current_server}/members/${userID}/`);
    firebase_object_here.rtdb.set(memberRef,null);
  }
  
  
  function promote_to_admin(username, userID, firebase_object_here) {
    let roleRef = firebase_object_here.rtdb.child(firebase_object_here.titleRef,`users/${userID}/roles/admin/`);
    firebase_object_here.rtdb.set(roleRef,true);
  }
  
  export { demote_to_pleb, kick_from_server, promote_to_admin };