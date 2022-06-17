import * as firebase from '../../firebase';

export let sign_user_in = function (email,pwd) {
  fbauth.signInWithEmailAndPassword(auth, email, pwd).then(
    somedata => {
      console.log(somedata);
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
    return fbauth;
};