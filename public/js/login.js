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
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      let user = userCredential.user;
      let userIsAdmin = await checkAdmin(user.email);
      if (userIsAdmin) {
        let adminRole = await auditLoginCreate(user.email);
        let roleURL;
        if (adminRole == "csr") {
          roleURL = "Reports.html";
        }
        if (adminRole == "superuser") {
          roleURL = "Admins.html";
        }
        if (adminRole == "admin L2") {
          roleURL = "ApprCust.html";
        }
        if (adminRole == "admin L3") {
          roleURL = "PendCust.html";
        }
        window.open(roleURL + "?user-role=" + adminRole, "_self");
      } else {
        loginError();
      }
    })
    .catch((error) => {
      console.error("Error Signing In: ", error.code, error.message);
      loginError();
    });
};

let auditLoginCreate = async (email) => {
  let adminRecordRef = database.ref("admins");
  let adminSnapshot = await adminRecordRef.once("value");
  let adminData = adminSnapshot.val();
  let adminKeys = Object.keys(adminData);
  let adminEmails = [];
  let adminNumber;
  for (let i = 0; i <= adminKeys[adminKeys.length - 1]; i++) {
    if (adminKeys.includes(i.toString())) {
      adminEmails.push(adminData[i].username);
    } else {
      adminEmails.push(undefined);
    }
  }
  for (let i = 0; i < adminEmails.length; i++) {
    if (adminEmails[i] == email) {
      adminNumber = i;
    }
  }
  let adminLogsRef = database.ref("admins/" + adminNumber.toString() + "/logs");
  let adminLogsSnapshot = await adminLogsRef.once("value");
  let adminLogsData = adminLogsSnapshot.val();
  let newLogsRef = database.ref(
    "admins/" +
      adminNumber.toString() +
      "/logs/" +
      adminLogsData.length.toString()
  );
  let newLogsData = {
    action: "Log-In",
    timestamp: displayTime(),
    creator: email.toString(),
    role: " ",
  };
  await newLogsRef.set(newLogsData);
  return adminData[adminNumber].role;
};

let displayTime = () => {
  let str = "";

  let currentTime = new Date();
  let day = currentTime.getDate();
  let month = currentTime.getMonth();
  let year = currentTime.getFullYear();
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let seconds = currentTime.getSeconds();

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  str +=
    month +
    1 +
    "/" +
    day +
    "/" +
    year +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    " ";
  if (hours > 11) {
    str += "PM";
  } else {
    str += "AM";
  }
  return str;
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
    adminData = snapshot.val();
    adminData = Object.values(adminData);
    if (adminData) {
      adminData.forEach((data) => {
        if (data.username == userEmail) {
          returnValue = true;
        }
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
