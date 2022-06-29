import { demote_to_pleb, kick_from_server, promote_to_admin } from './user_handling.js';

let firebase_object_here;
let current_server;

function render_servers(firebase_object, server_data_raw, user_info) {
  let uid = user_info.uid;
  let server_data = server_data_raw;
  let serverIds = Object.keys(server_data);
  $(".servers").empty();
  serverIds.map((name) => {
    if (server_data[name].members[uid]) {
      if (user_info.role === "admin") {
        $(".servers").append(
          `<li  >
            <div class="server_list_item">
              <a class="server_object"  data-id='${name}'>
                ${name}
              </a>
         	    <div class="edit">
                <a  href="#">
                  <i id='${name}' title="Delete Server" class="fa fa-times fa-sm  text-danger" >
                  </i>
                </a>
              </div>
            </div>
          </li>`
        );
        $(`#${name}`).click(() => {
          server_name_delete(name);
        });
      } else {
        $(".servers").append(
          `<li  >
            <div class="server_list_item">
              <a class="server_object" data-id=${name}>
                ${name}
              </a>
            </div>
          </li>`
        );
      }
      $(".server_object").click(click_handler_server);
    }
  });
}

function server_name_delete(name) {
  let are_you_sure = confirm(`Are you sure you want\nto remove ${name}?`);
  if (are_you_sure === true) {
    let titleRef = firebase_object_here.rtdb.ref(firebase_object_here.db, "/");
    let chatRefRemove = firebase_object_here.rtdb.child(
      titleRef,
      `chatServers/${name}/`
    );
    firebase_object_here.rtdb.set(chatRefRemove, null);
  }
  console.log(name);
}

let click_handler_server = function (evt) {
  let clickedElement = evt.currentTarget;
  let idFromDOM = $(clickedElement).attr("data-id");
  let userServerRef = firebase_object_here.rtdb.child(
    firebase_object_here.titleRef,
    `users/${firebase_object_here.auth.currentUser.uid}`
  );
  firebase_object_here.rtdb.update(userServerRef, { server: idFromDOM });
};

function render_messages(firebase_object, server_data_raw, current_server) {
  let server_data = server_data_raw;
  let messages = Object.keys(server_data[current_server].messages);
  $(".messages").empty();
  messages.map((each_message) => {
    console.log(server_data[current_server].messages[each_message])
    if (
      server_data[current_server].messages[each_message].senderID ===
      firebase_object.auth.currentUser.uid
    ) {
      $(".messages").append(
        `<div class="message_from_me_parent">
          <div data-id='${each_message}' id='${each_message}' class="message_from_me">
            <div class="message_details">
              ${server_data[current_server].messages[each_message].timeStamp}
            </div>\
            <hr style="white" margin="6">
            ${server_data[current_server].messages[each_message].message}
            <div class="message_details">
              @${server_data[current_server].messages[each_message].senderName}
            </div>
        </div>`
      );
    } else {
      $(".messages").append(
        `<div data-id='${each_message}' class="message_not_from_me">
            <div class="message_details">
              ${server_data[current_server].messages[each_message].timeStamp}
            </div>\
            <hr style="white" margin="6">
            ${server_data[current_server].messages[each_message].message}
            <div class="message_details">
              @${server_data[current_server].messages[each_message].senderName}
            </div>
        </div>`
      );
    }
  });
}

function render_users(
  firebase_object,
  user_server_data,
  server_data_raw,
  current_server,
   user_info
) {
  let server_data = server_data_raw;
  let serverIds = Object.keys(server_data);
  let userIds = Object.keys(server_data[current_server].members);
  let user_data = user_server_data;
  $(".users").empty();
    if (user_info.role === "admin") {
  userIds.map((userID) => {
    let renderUser = server_data[current_server].members[userID].username;
    if (user_data[userID].roles["admin"] === true) {
      let demote = `${renderUser}` + "_demote";
      $(".users").append(`
          <li data-id=${renderUser}>
            <div class="user_list_item">
              
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
    let renderUser = server_data[current_server].members[userID].username;
    if (user_data[userID].roles["admin"] === false) {
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
    let renderUser = server_data[current_server].members[userID].username;
    if (user_data[userID].roles["admin"] === true) {
      let demote = `${renderUser}` + "_demote";
      $(".users").append(`
          <li data-id=${renderUser}>
            <div class="user_list_item">
              <a href="#">
                ${renderUser}-Admin
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
    let renderUser = server_data[current_server].members[userID].username;
    if (user_data[userID].roles["admin"] === false) {
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
  firebase_object_here = firebase_object;
  firebase_object.rtdb.onValue(firebase_object.titleRef, (server_data) => {
    let all_server_data = server_data.val();
    let chat_server_data = all_server_data["chatServers"];
    let user_server_data = all_server_data["users"];
    current_server = get_user_server(
      firebase_object,
      user_server_data,
      current_server
    );
    render_servers(firebase_object, chat_server_data, user_info);
    render_users(
      firebase_object,
      user_server_data,
      chat_server_data,
      current_server,
      user_info
    );
    render_messages(firebase_object, chat_server_data, current_server);
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
    user_info.uid = uid;
    console.log(uid);
    console.log(user_data.val()[uid]);
    user_info.username = current_server = user_data.val()[uid].name;
    user_info.server = current_server = user_data.val()[uid].server;
    if (user_data.val()[uid].roles["admin"] === true) {
      user_info.role = "admin";
      $(".admin_tools").css({ display: "contents" });
    } else {
      user_info.role = "user";
      $(".admin_tools").css({ display: "none" });
    }
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
