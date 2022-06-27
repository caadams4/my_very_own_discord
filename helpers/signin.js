export function sign_user_in(email, pwd, firebase_object, uid) {
  uid = "";
  firebase_object.fbauth
    .signInWithEmailAndPassword(firebase_object.auth, email, pwd)
    .then((somedata) => {
      console.log(somedata);
      uid = somedata.user.uid;
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
}

