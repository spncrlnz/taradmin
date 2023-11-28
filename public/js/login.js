const firebaseConfig = {
  apiKey: "AIzaSyAD6x004HaVP5RxxiJ9Sui3a2SdxN2hhe4",
  authDomain: "tapandrepair-online-cace3.firebaseapp.com",
  databaseURL: "https://tapandrepair-online-cace3-default-rtdb.firebaseio.com",
  projectId: "tapandrepair-online-cace3",
  storageBucket: "tapandrepair-online-cace3.appspot.com",
  messagingSenderId: "101753671107",
  appId: "1:101753671107:web:d38750e9c981de44364176",
  measurementId: "G-YNQ5V3JNEL",
};

firebase.initializeApp(firebaseConfig);

let database = firebase.database();
let adminsRef = database.ref("admins");

let incorrectLogin = false;
let Login = async () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  /*if (email == "tapandrepairtar@gmail.com" && password == "TARTARus") {
    email = "frondakd7@gmail.com";
    password = "Qwerty123@";
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let user = userCredential.user;
        console.log("User Signed In: ", user);
        const snapshot = await;
        //window.open("PendCust.html", "_self");
      })
      .catch((error) => {
        console.error("Error Singning In: ", error.code, error.message);
      });
  } else {
    if (!incorrectLogin) {
      let errorContainer = document.getElementById("login-error");
      let errorText = document.createTextNode("Incorrect Username/Password");
      errorContainer.appendChild(errorText);
      incorrectLogin = true;
    }
  }*/
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      let user = userCredential.user;
      let userIsAdmin = await checkAdmin(user.email);
      if (userIsAdmin) {
        window.open("PendCust.html", "_self");
      } else {
        loginError();
      }
    })
    .catch((error) => {
      console.error("Error Signing In: ", error.code, error.message);
      loginError();
    });
};

let loginError = () => {
  if (!incorrectLogin) {
    let errorContainer = document.getElementById("login-error");
    let errorText = document.createTextNode("Incorrect Username/Password");
    errorContainer.appendChild(errorText);
    incorrectLogin = true;
  }
};

let checkAdmin = async (userEmail) => {
  let returnValue = false;
  try {
    const snapshot = await adminsRef.once("value");
    console.log(userEmail);
    adminData = snapshot.val();
    adminData = Object.values(adminData);
    if (adminData) {
      adminData.forEach((data) => {
        if (data.username == userEmail) returnValue = true;
      });
    }
  } catch (error) {
    console.error("Error Checking Admin Users: ", error.code, error.message);
  }
  return returnValue;
};

function ShowPassword() {
  var x = document.getElementById("password");
  var y = document.getElementById("hide1");
  var z = document.getElementById("hide2");

  if (x.type === "password") {
    x.type = "text";
    y.style.display = "block";
    z.style.display = "none";
  } else {
    x.type = "password";
    y.style.display = "none";
    z.style.display = "block";
  }
}
