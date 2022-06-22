function render_servers(firebase_object, server_data, current_server) {
  let servers = server_data.val();
  let serverIds = Object.keys(servers);
  $(".servers").empty();
  serverIds.map((name) => {
    $(".servers").append(
      `<li class="servers" data-id=${name}>
        <a href="#">
          <ion-icon name="home-outline" class="icon"></ion-icon>${name}
        </a>
      </li>`
    );
  });
  let userIds = Object.keys(servers[current_server].members);
  $(".users").empty();
  userIds.map((user) => {
    let renderUser = servers[current_server].members[user].username;

    $(".users").append(
      `<li class="users" data-id=${renderUser}>
        <a href="#">
          <ion-icon name="home-outline" class="icon"></ion-icon>${renderUser}
        </a>
      </li>`
    );
  });
}

function render_messages(firebase_object, server_data, current_server) {
  let servers = server_data.val();
  let messages = Object.keys(servers[current_server].messages);
    $(".messages").empty();
  messages.map((each_message) => {
    if (servers[current_server].messages[each_message].senderID === firebase_object.auth.currentUser.uid) {
      $(".messages").append(
        `<div data-id='${each_message} class="message_from_me" style="color:white"'>
          ${servers[current_server].messages[each_message].message}
        </div>`
      );
    } else {
      $(".messages").append(
        `<div data-id='${each_message} class="message_not_from_me"'>
          ${servers[current_server].messages[each_message].message}
        </div>`
      );
    }
    console.log(servers[current_server].messages[each_message].message)
  });
}

export { render_servers, render_messages };
