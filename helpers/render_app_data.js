import {
  demote_to_pleb,
  kick_from_server,
  promote_to_admin,
} from "./user_handling.js";

let firebase_object_here;
let current_server;

function render_servers(firebase_object, server_data_raw, user_info) {
  let server_data = server_data_raw.val();
  console.log("SERVER LIST = ")
  console.log(server_data)
  let serverIds = Object.keys(server_data);
  $(".servers").empty();
  serverIds.map((id) => {
      if (user_info.role === "admin") {
        $(".servers").append(
          `<li  >
            <div class="server_list_item">
              <a class="server_object"  data-id='${server_data[id]}' >
                ${server_data[id]}
              </a>
         	    <div class="edit">
                <a  href="#">
                  <i id='${server_data[id]}_delete' title="Delete Server" class="fa fa-times fa-sm  text-danger" >
                  </i>
                </a>
              </div>
            </div>
          </li>`
        );
        $(`#${server_data[id]}_delete`).click(() => {
          server_name_delete(firebase_object,server_data[id]);
        });
      } else {
        $(".servers").append(
          `<li  >
            <div class="server_list_item">
              <a class="server_object" data-id=${server_data[id]}>
                ${server_data[id]}
              </a>
            </div>
          </li>`
        );
      }
      $(".server_object").click((evt)=>{
        click_handler_server(firebase_object,evt);
      });
    });
  
}

function server_name_delete(firebase_object,name) {
  let are_you_sure = confirm(`Are you sure you want\nto remove ${name}?`);
  if (are_you_sure === true) {
    let titleRef = firebase_object_here.rtdb.ref(firebase_object_here.db, "/");
    let chatRefRemove = firebase_object_here.rtdb.child(
      titleRef,
      `chatServers/${name}/`
    );
    
    firebase_object_here.rtdb.set(chatRefRemove, null);
  }
}

let click_handler_server = function (firebase_object_here,evt) {
  let clickedElement = evt.currentTarget;
  let idFromDOM = $(clickedElement).attr("data-id");

  let userServerRef = firebase_object_here.rtdb.child(
    firebase_object_here.titleRef,
    `users/${firebase_object_here.auth.currentUser.uid}`
  );
  
  let currentServerRef = firebase_object_here.rtdb.child(
    firebase_object_here.titleRef,
    `chatServers/${idFromDOM}/members/`);
  
  
  firebase_object_here.rtdb.get(currentServerRef).then((data)=>{
      let server_data = data.val();
      let uids = Object.keys(server_data);
      let has_access = false;
      uids.forEach((uid) => {
        if (uid === firebase_object_here.auth.currentUser.uid) { 
          firebase_object_here.rtdb.update(userServerRef, { server: idFromDOM });
          has_access = true;
        }
      
    
      });
      if (!has_access) alert("You don't have access to this server");
  })
  }

function render_messages(firebase_object, current_server) {
  let serverMessagesRef = firebase_object.rtdb.child(
    firebase_object.titleRef,
    `chatServers/${current_server}/messages`
  );
  firebase_object.rtdb.onValue(serverMessagesRef, (message_data) => {
    let message_object = message_data.val();
    let messages = Object.keys(message_object);
    $(".messages").empty();
    messages.map((each_message) => {
      if (
        message_object[each_message].senderID ===
        firebase_object.auth.currentUser.uid
      ) {
        $(".messages").append(
          `<div class="message_from_me_parent">
          <div data-id='${each_message}' id='${each_message}' class="message_from_me">
            <div class="message_details">
              ${message_object[each_message].timeStamp}
            </div>\
            <hr style="white" margin="6">
            ${message_object[each_message].message}
            <div class="message_details">
              @${message_object[each_message].senderName}
            </div>
        </div>`
        );
      } else {
        $(".messages").append(
          `<div data-id='${each_message}' class="message_not_from_me">
            <div class="message_details">
              ${message_object[each_message].timeStamp}
            </div>\
            <hr style="white" margin="6">
            ${message_object[each_message].message}
            <div class="message_details">
              @${message_object[each_message].senderName}
            </div>
        </div>`
        );
      }
    });
  });
}

function render_users(
  firebase_object,
  admin_uids,
  current_server,
  user_info
) {
    console.log(current_server)
  let userIds = Object.keys(current_server['members']);
  $(".users").empty();
  if (admin_uids.includes(user_info.uid)) {
    userIds.map((userID) => {
      let renderUser = current_server.members[userID].username;
      if (admin_uids.includes(userID)) {
        let demote = `${renderUser}` + "_demote";
        $(".users").append(`
          <li data-id=${renderUser}>
            <div class="user_list_item" title='admin'>
              
              <a href="#">
              <i class="fa fa-user-circle" aria-hidden="true"></i>
                ${renderUser}
              </a>
         	    <div class="edit">
              <a href="#">
                <i id='${demote}' class="fa fa-user-times" title="Promote to Pleb"></i>
              </a>
              </div>
            </div>
          </li>
        `);
        $(`#${demote}`).click(() => {
          demote_to_pleb(name, userID, firebase_object_here);
        });
      }
    });
    userIds.map((userID) => {
      let renderUser = current_server.members[userID].username;
      if (!admin_uids.includes(userID)) {
        let kick = `${renderUser}` + "_kick";
        let promote = `${renderUser}` + "_promote";
        $(".users").append(`
          <li data-id=${renderUser}>
            <div class="user_list_item">
              <a href="#">
                ${renderUser}
              </a>
         	    <div class="edit">
                <div>
                  <a href="#">
                    <i id='${promote}' class="fa fa-user-plus" title="Promote to Admin" ></i>
                    <i id='${kick}' class="fa fa-window-close" style="margin-left:10px;" title="Kick from Server"></i>
                  </a>
                </div>
              </div>
            </div>
          </li>
        `);
        $(`#${kick}`).click(() => {
          kick_from_server(name, userID, current_server, firebase_object_here);
        });
        $(`#${promote}`).click(() => {
          promote_to_admin(name, userID, firebase_object_here);
        });
      }
    });
  } else {
    userIds.map((userID) => {
      let renderUser = current_server.members[userID].username;
      if (admin_uids.includes(userID)) {
        let demote = `${renderUser}` + "_demote";
        $(".users").append(`
          <li data-id=${renderUser}>
            <div class="user_list_item">
            
              <a href="#">
                <i class="fa fa-user-circle" title="Admin" ></i>
                ${renderUser}
              </a>
            </div>
          </li>
        `);
        $(`#${demote}`).click(() => {
          demote_to_pleb(name, userID, firebase_object_here);
        });
      }
    });
    userIds.map((userID) => {
      let renderUser = current_server.members[userID].username;
      if (!admin_uids.includes(userID)) {
        let kick = `${renderUser}` + "_kick";
        let promote = `${renderUser}` + "_promote";
        $(".users").append(`
          <li data-id=${renderUser}>
            <div class="user_list_item">
              <a href="#">
                ${renderUser}
              </a>
            </div>
          </li>
        `);
        $(`#${kick}`).click(() => {
          kick_from_server(name, userID, current_server, firebase_object_here);
        });
        $(`#${promote}`).click(() => {
          promote_to_admin(name, userID, firebase_object_here);
        });
      }
    });
  }
}

function get_user_server(firebase_object, user_data_raw, current_server) {
  let user = user_data_raw;
  let uid = firebase_object.auth.currentUser.uid;
  current_server = user[uid].server;
  return current_server;
}

function database_listen_for_change(firebase_object, user_info) {
  let currentServerRef = firebase_object.rtdb.child(
    firebase_object.titleRef,
    `users/${firebase_object.auth.currentUser.uid}/server/`
  );

  firebase_object.rtdb.onValue(currentServerRef, (user_data) => {
    let current_server = user_data.val();
    render_messages(firebase_object, current_server);
  });

  currentServerRef = firebase_object.rtdb.child(
    firebase_object.titleRef,
    `chatServers/${user_info.server}/`
  );
  let roleRef = firebase_object.rtdb.child(
    firebase_object.titleRef,
    `groups/admins/`
  );

  firebase_object.rtdb.onValue(currentServerRef, (server_data) => {
    let current_server = server_data.val()[user_info.server];
    console.log(current_server)
    firebase_object.rtdb.onValue(roleRef, (role_data) => {
      let admins_data = role_data.val();
      let admin_uids = Object.keys(admins_data)
      render_users(
        firebase_object,
        admin_uids,
        current_server,
        user_info
      );
    });

    /*
    current_server = get_user_server(
      firebase_object,
      user_server_data,
      current_server
    );
    */
  let serverListRef = firebase_object.rtdb.child(
    firebase_object.titleRef,
    `servers/`
  );
    firebase_object.rtdb.onValue(serverListRef, (server_list) => {
      
    render_servers(firebase_object, server_list, user_info);
    });

    return current_server;
  });
  return current_server;
}

function build_user_info(firebase_object, user_info) {
  user_info = {
    uid: "",
    username: "",
    server: "",
    role: "",
  };
  firebase_object.rtdb.onValue(firebase_object.userRef, (user_data) => {
    let uid = firebase_object.auth.currentUser.uid;
    console.log(firebase_object.auth.currentUser.uid);
    user_info.uid = uid;
    // console.log(user_data.val()[uid]);
    console.log(user_data.val());
    user_info.username = current_server = user_data.val()[uid].name;
    user_info.server = current_server = user_data.val()[uid].server;
    if (user_data.val()[uid].roles["admin"] === true) {
      user_info.role = "admin";
      $(".admin_tools").css({ display: "contents" });
    } else {
      user_info.role = "user";
      $(".admin_tools").css({ display: "none" });
    }
    console.log(user_info);
  });
  return user_info;
}

export {
  build_user_info,
  database_listen_for_change,
  render_servers,
  render_messages,
  render_users,
  get_user_server,
};
