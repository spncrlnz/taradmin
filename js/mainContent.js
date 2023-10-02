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
let dataRef = database.ref("users");
let data;
let dataChildren = [];
let dataQuery;
// User Object
let userObject = {
  approved: Boolean,
  booked: Boolean,
  contactnumber: String,
  email: String,
  fullname: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  online: Boolean,
  password: String,
  profilePictureUrl: String,
  rating: {
    finalRating: Number,
    ratingCount: Number,
    totalRating: Number,
  },
  servicetype: String,
  shoplocation: String,
  shopname: String,
  usertype: String,
  verified: Boolean,
};

let retrieveData = () => {
  return new Promise((resolve) => {
    dataRef.on("value", (snapshot) => {
      data = snapshot.val();
      if (data) {
        dataChildren = Object.values(data);
      } else {
        dataChildren = []; // Initialize dataChildren as an empty array if data is null
      }
      resolve();
    });
  });
};

let closeMap = () => {
  let mapContainer = document.getElementById("mapContainer");
  mapContainer.remove();
};

let viewLocation = (index) => {
  let pageContainer = document.getElementById("pageContainer");
  let mapContainer = document.createElement("div");
  let mapBackground = document.createElement("div");
  let mapContents = document.createElement("div");
  mapContainer.setAttribute("class", "mapContainer");
  mapContainer.setAttribute("id", "mapContainer");
  mapContainer.setAttribute("style", "z-index: 99");
  mapBackground.setAttribute("class", "mapBackground");
  mapContents.setAttribute("id", "mapContents");
  mapContents.setAttribute("class", "mapContents");
  let locationHTMLString = document.createElement("iframe");
  let mapClose = document.createElement("div");
  mapClose.setAttribute("class", "mapClose");
  mapClose.setAttribute("onclick", "closeMap()");
  let mapCloseText = document.createTextNode("CLOSE");
  locationHTMLString.setAttribute(
    "src",
    "https://maps.google.com/maps?q=" +
      dataChildren[index - 1].location.latitude +
      "," +
      dataChildren[index - 1].location.longitude +
      "&t=&z=16&ie=UTF8&iwloc=&output=embed"
  );
  locationHTMLString.setAttribute("width", "800");
  locationHTMLString.setAttribute("height", "600");
  locationHTMLString.setAttribute("frameborder", "0");
  locationHTMLString.setAttribute("style", "border:0;");
  locationHTMLString.setAttribute("allowfullscreen", "");
  pageContainer.appendChild(mapContainer);
  mapContainer.appendChild(mapBackground);
  mapBackground.appendChild(mapContents);
  mapBackground.appendChild(mapClose);
  mapClose.appendChild(mapCloseText);
  mapContents.appendChild(locationHTMLString);
};

let createRow = (rowObject, index) => {
  // FullName > Email > Number > Email-Status > Document > Reject > Approve
  userObject = rowObject;
  let parent = document.getElementById("table-content");
  let row = document.createElement("tr");
  let fullNameData = document.createTextNode(userObject.fullname);
  let emailData = document.createTextNode(userObject.email);
  let numberData = document.createTextNode(userObject.contactnumber);
  let emailStatusData = document.createTextNode(userObject.verified);
  let documentData = document.createTextNode(userObject.profilePictureUrl);
  let blankData = document.createTextNode("N/A");
  let trueData = document.createTextNode("Verified");
  let falseData = document.createTextNode("Not Verified");
  let approveButton = document.createElement("button");
  let rejectButton = document.createElement("button");
  let terminateButton = document.createElement("button");
  let locationButton = document.createElement("button");
  let approveData = document.createTextNode("APPROVE");
  let rejectData = document.createTextNode("REJECT");
  let terminateData = document.createTextNode("TERMINATE");
  let locationData = document.createTextNode("LOCATION");
  approveButton.appendChild(approveData);
  rejectButton.appendChild(rejectData);
  terminateButton.appendChild(terminateData);
  locationButton.appendChild(locationData);
  locationButton.setAttribute("key", index);
  locationButton.setAttribute("onclick", "viewLocation(" + index + ")");
  let dataArray = [];
  if (dataQuery == "PendCust" || dataQuery == "PendMech") {
    dataArray = [
      fullNameData,
      emailData,
      numberData,
      emailStatusData,
      documentData,
      rejectButton,
      approveButton,
    ];
  }
  if (dataQuery == "ApprCust" || dataQuery == "ApprMech") {
    dataArray = [
      fullNameData,
      emailData,
      numberData,
      emailStatusData,
      documentData,
      terminateButton,
    ];
  }
  if (dataQuery == "PendSO") {
    dataArray = [
      fullNameData,
      emailData,
      numberData,
      emailStatusData,
      documentData,
      locationButton,
      rejectButton,
      approveButton,
    ];
  }
  if (dataQuery == "ApprSO") {
    dataArray = [
      fullNameData,
      emailData,
      numberData,
      emailStatusData,
      documentData,
      locationButton,
      terminateButton,
    ];
  }
  for (let i = 0; i < dataArray.length; i++) {
    let item = document.createElement("th");
    if (dataArray[i].nodeValue != "undefined") {
      if (dataArray[i].nodeValue == "true") item.appendChild(trueData);
      else if (dataArray[i].nodeValue == "false") item.appendChild(falseData);
      else item.appendChild(dataArray[i]);
      row.appendChild(item);
      parent.appendChild(row);
    } else {
      item.appendChild(blankData);
      row.appendChild(item);
      parent.appendChild(row);
    }
  }
};

retrieveData().then(() => {
  if (dataChildren) {
    dataChildren.forEach((obj, index) => {
      // Your code to create and append table rows goes here
      if (dataQuery == "PendCust") {
        if (obj.usertype == "Customer" && obj.approved == false)
          createRow(obj, index);
      }
      if (dataQuery == "ApprCust") {
        if (obj.usertype == "Customer" && obj.approved == true)
          createRow(obj, index);
      }
      if (dataQuery == "PendMech") {
        if (obj.usertype == "Mechanic" && obj.approved == false)
          createRow(obj, index);
      }
      if (dataQuery == "ApprMech") {
        if (obj.usertype == "Mechanic" && obj.approved == true)
          createRow(obj, index);
      }
      if (dataQuery == "PendSO") {
        if (obj.usertype == "Repair Shop" && obj.approved == false)
          createRow(obj, index);
      }
      if (dataQuery == "ApprSO") {
        if (obj.usertype == "Repair Shop" && obj.approved == true)
          createRow(obj, index);
      }
    });
  } else {
    console.log("No data available."); // Handle the case when data is null
  }
});

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
