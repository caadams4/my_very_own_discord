function demote_to_pleb(username, userID, firebase_object_here) { 
  // for admins, demote other admin to user
  
  let roleRef = firebase_object_here.rtdb.child(firebase_object_here.titleRef,`users/${userID}/roles/admin/`);
  firebase_object_here.rtdb.set(roleRef,false); // set target user admin role to false
    let admin_group_ref = firebase_object_here.rtdb.ref(
        firebase_object_here.db,
        `/groups/admin/${firebase_object_here.auth.currentUser.uid}`
      );
      firebase_object_here.rtdb.set(admin_group_ref,null);
}

function kick_from_server(username, userID, current_server, firebase_object_here) { 
  // for admins, kick user out of server
  
  let memberRef = firebase_object_here.rtdb.child(firebase_object_here.titleRef,`chatServers/${current_server}/members/${userID}/`);
  firebase_object_here.rtdb.set(memberRef,null); // set target user membership to null
}


function promote_to_admin(username, userID, firebase_object_here) { 
  // for admins, promote user to server
  
  let roleRef = firebase_object_here.rtdb.child(firebase_object_here.titleRef,`users/${userID}/roles/admin/`);
  firebase_object_here.rtdb.set(roleRef,true); // set target user admin role to true
  let admin_group_ref = firebase_object_here.rtdb.ref(
        firebase_object_here.db,
        `/groups/admin/${firebase_object_here.auth.currentUser.uid}`
      );
      let admin_group = {
        username,
      };
      firebase_object_here.rtdb.set(admin_group_ref, admin_group); // add user info to admin group
}

export { demote_to_pleb, kick_from_server, promote_to_admin };