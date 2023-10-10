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

let retrieveReports = async () => {
  try {
    const snapshot = await reportsRef.once("value");
    reportsData = snapshot.val();
    reportsData = Object.values(reportsData);
    let row = document.createElement("tr");
    if (reportsData) {
      reportsData.forEach((data) => {
        tableParent.appendChild(row);
        createRows(data, row);
      });
    } else {
      let rowItem = document.createElement("th");
      let rowItemText = document.createTextNode("No Available Data");
      tableParent.appendChild(row);
      row.appendChild(rowItem);
      rowItem.appendChild(rowItemText);
    }
  } catch (error) {
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
