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

const urlParams = new URLSearchParams(window.location.search);
const adminRole = urlParams.get("user-role");

let usersContainer = document.getElementById("users");
let pendingCustomerButton = document.getElementById("pending-customer");
let pendingMechanicButton = document.getElementById("pending-mechanic");
let pendingShopButton = document.getElementById("pending-shop");
let approvedCustomerButton = document.getElementById("approved-customer");
let approvedMechanicButton = document.getElementById("approved-mechanic");
let approvedShopButton = document.getElementById("approved-shop");
let adminUsers = document.getElementById("users-admin");
let reportsUser = document.getElementById("users-reports");
let pendingUsers = document.getElementById("pending-users");
let approvedUsers = document.getElementById("approved-users");

pendingCustomerButton.onclick = () => {
  window.open("PendCust.html?user-role=" + adminRole, "_self");
};
pendingMechanicButton.onclick = () => {
  window.open("PendMech.html?user-role=" + adminRole, "_self");
};
pendingShopButton.onclick = () => {
  window.open("PendSO.html?user-role=" + adminRole, "_self");
};
approvedCustomerButton.onclick = () => {
  window.open("ApprCust.html?user-role=" + adminRole, "_self");
};
approvedMechanicButton.onclick = () => {
  window.open("ApprMech.html?user-role=" + adminRole, "_self");
};
approvedShopButton.onclick = () => {
  window.open("ApprSO.html?user-role=" + adminRole, "_self");
};
adminUsers.onclick = () => {
  window.open("Admins.html?user-role=" + adminRole, "_self");
};
reportsUser.onclick = () => {
  window.open("Reports.html?user-role=" + adminRole, "_self");
};

if (adminRole == "csr") {
  usersContainer.remove();
  adminUsers.remove();
}

if (adminRole == "admin L2") {
  pendingUsers.remove();
  adminUsers.remove();
  reportsUser.remove();
}

if (adminRole == "admin L3") {
  approvedUsers.remove();
  adminUsers.remove();
  reportsUser.remove();
}

const data = urlParams.get("data");
let database = firebase.database();
let adminRef = database.ref("admins/" + data.slice(13));
let adminData;
let logsData = [];

let getAdminLogs = async () => {
  let adminSnapshot = await adminRef.once("value");
  adminData = adminSnapshot.val();
  logsData = adminData.logs;
  for (let i = logsData.length - 1; i >= 0; i--) {
    createLogRows(i);
  }
};

let createLogRows = (i) => {
  let tableContent = document.getElementById("table-content");
  let row = document.createElement("tr");
  let itemTimestamp = document.createElement("th");
  let itemCreator = document.createElement("th");
  let itemAction = document.createElement("th");
  let itemRole = document.createElement("th");
  let itemEmail = document.createElement("th");
  let logTimestamp = document.createTextNode(logsData[i].timestamp);
  let logCreator = document.createTextNode(
    logsData[i].creator ? logsData[i].creator : ""
  );
  let logAction = document.createTextNode(logsData[i].action);
  let logRole = document.createTextNode(logsData[i].role);
  let logEmail = document.createTextNode(adminData.username);
  tableContent.appendChild(row);
  row.appendChild(itemTimestamp);
  row.appendChild(itemCreator);
  row.appendChild(itemAction);
  row.appendChild(itemRole);
  row.appendChild(itemEmail);
  itemTimestamp.appendChild(logTimestamp);
  itemCreator.appendChild(logCreator);
  itemAction.appendChild(logAction);
  itemRole.appendChild(logRole);
  itemEmail.appendChild(logEmail);
};

function signout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert(error);
    });
}

getAdminLogs();
