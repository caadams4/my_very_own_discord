export function sign_user_in (email,pwd,firebaseObj) {
  firebaseObj.fbauth.signInWithEmailAndPassword(firebaseObj.auth, email, pwd).then(
    somedata => {
      console.log(somedata);
      return somedata.user.uid;
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
};