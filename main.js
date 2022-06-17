import * as firebase from '../firebase';
import { create_user } from './helpers/register';
import { sign_user_in } from './helpers/signin';

let email,password,username,password2;

$(document).ready(function () {

    $(".submit").submit(function () {

        email = $("#email_signin").val();
        password = $("#password_signin").val();
        firebase.fbauth = sign_user_in(email,password);

        console.log(firebase.fbauth);
    });

    $( "#register_user" ).submit(function( event ) {

        email = $("#email_register").val();
        password = $("#password_register").val();
        password = $("#password2_register").val();
        username = $("#username_register").val();

        firebase.fbauth = create_user(email,username,password,password2);
        


        console.log(firebase.fbauth);
      });
});