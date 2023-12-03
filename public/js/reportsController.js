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
let reportsRef = database.ref("reports");
let reportsData = [];
let tableParent = document.querySelector(".dataTable");

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

let retrieveReports = async () => {
  try {
    const snapshot = await reportsRef.once("value");
    reportsData = snapshot.val();
    reportsData = Object.values(reportsData);
    if (reportsData) {
      reportsData.forEach((data) => {
        let row = document.createElement("tr");
        tableParent.appendChild(row);
        createRows(data, row);
      });
    } else {
      let row = document.createElement("tr");
      let rowItem = document.createElement("th");
      let rowItemText = document.createTextNode("No Available Data");
      tableParent.appendChild(row);
      row.appendChild(rowItem);
      rowItem.appendChild(rowItemText);
    }
  } catch (error) {
    let row = document.createElement("tr");
    let rowItem = document.createElement("th");
    let rowItemText = document.createTextNode("No Available Data");
    tableParent.appendChild(row);
    row.appendChild(rowItem);
    rowItem.appendChild(rowItemText);
    console.error("Error retrieving reports data:", error);
  }
};

let createRows = async (data, row) => {
  let reportedName = await getName(data.reportedUserID);
  let reporterName = await getName(data.reporterUserID);
  let dataArray = [reportedName, data.reportText, data.timestamp, reporterName];

  dataArray.forEach((element) => {
    let rowItem = document.createElement("th");
    row.appendChild(rowItem);
    let rowItemText = document.createTextNode(element);
    rowItem.appendChild(rowItemText);
  });
};

let getName = async (userId) => {
  try {
    let nameRef = database.ref("users/" + userId);
    const snapshot = await nameRef.once("value");
    const user = snapshot.val();
    return user.fullname;
  } catch {
    console.error("Error retrieving Name:", error);
  }
};

retrieveReports();

//SignOut Button
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
