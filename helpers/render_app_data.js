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
    userIds.map(user=>{
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
  
  
  
  export { render_servers };
  