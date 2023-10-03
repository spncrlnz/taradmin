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
  let locationHTMLString = document.createElement("iframe");
  let mapClose = document.createElement("div");

  let mapCloseText = document.createTextNode("CLOSE");

  mapContainer.setAttribute("class", "mapContainer");
  mapContainer.setAttribute("id", "mapContainer");
  mapContainer.setAttribute("style", "z-index: 99");
  mapBackground.setAttribute("class", "mapBackground");
  mapContents.setAttribute("id", "mapContents");
  mapContents.setAttribute("class", "mapContents");
  mapClose.setAttribute("class", "mapClose");
  mapClose.setAttribute("onclick", "closeMap()");
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

let removeConfirmationForm = () => {
  let confirmationForm = document.getElementById("confirmationContainer");
  confirmationForm.remove();
};

let confirmationForm = (action, userIdRef, index) => {
  let confirmationText = document.createTextNode(
    "Are you sure you want to " + action + " the user?"
  );
  let pageContainer = document.getElementById("pageContainer");
  let confirmationContainer = document.createElement("div");
  let confirmationBackground = document.createElement("div");
  let confirmationContents = document.createElement("div");
  let confirmationButtonContainer = document.createElement("div");
  let confirmationButtonConfirm = document.createElement("div");
  let confirmationButtonCancel = document.createElement("div");
  let confirmText = document.createTextNode("CONFIRM");
  let cancelText = document.createTextNode("CANCEL");

  pageContainer.appendChild(confirmationContainer);
  confirmationContainer.appendChild(confirmationBackground);
  confirmationBackground.appendChild(confirmationContents);
  confirmationContents.appendChild(confirmationText);
  confirmationBackground.appendChild(confirmationButtonContainer);
  confirmationButtonContainer.appendChild(confirmationButtonCancel);
  confirmationButtonContainer.appendChild(confirmationButtonConfirm);
  confirmationButtonCancel.appendChild(cancelText);
  confirmationButtonConfirm.appendChild(confirmText);

  confirmationContainer.setAttribute("class", "confirmationContainer");
  confirmationContainer.setAttribute("id", "confirmationContainer");
  confirmationContainer.setAttribute("style", "z-index: 99");
  confirmationBackground.setAttribute("class", "confirmationBackground");
  confirmationContents.setAttribute("class", "confirmationContents");
  confirmationContents.setAttribute("id", "confirmationContents");
  confirmationContents.setAttribute("style", "margin: 10px;");
  confirmationButtonContainer.setAttribute(
    "class",
    "confirmationButtonContainer"
  );
  confirmationButtonContainer.setAttribute("style", "margin: 10px;");
  confirmationButtonCancel.setAttribute("style", "cursor: pointer;");
  confirmationButtonCancel.setAttribute("onclick", "removeConfirmationForm()");
  confirmationButtonConfirm.setAttribute("style", "cursor: pointer;");

  if (action == "approve") {
    confirmationButtonConfirm.setAttribute(
      "onclick",
      'approveData("' + userIdRef + '", ' + index + ")"
    );
  }
  if (action == "remove") {
    confirmationButtonConfirm.setAttribute(
      "onclick",
      'removeData("' + userIdRef + '", ' + index + ")"
    );
  }
};

let removeData = (userIdRef, index) => {
  userIdRef = "users/" + userIdRef;
  userIdRef = database.ref(userIdRef);
  userIdRef.remove();

  let rowItem = document.getElementById("row" + index);
  rowItem.remove();

  removeConfirmationForm();
};

let approveData = (userIdRef, index) => {
  userIdRef = "users/" + userIdRef + "/approved";
  userIdRef = database.ref(userIdRef);
  userIdRef.set(true);

  let rowItem = document.getElementById("row" + index);
  rowItem.remove();

  removeConfirmationForm();
};

let createRow = (rowObject, index, userId) => {
  // FullName > Email > Number > Email-Status > Document > Reject > Approve
  userObject = rowObject;

  let parent = document.getElementById("table-content");

  let row = document.createElement("tr");
  let blankData = document.createTextNode("N/A");
  let trueData = document.createTextNode("Verified");
  let falseData = document.createTextNode("Not Verified");
  let documentButton = document.createElement("a");
  let documentContent = document.createElement("button");
  let approveButton = document.createElement("button");
  let rejectButton = document.createElement("button");
  let terminateButton = document.createElement("button");
  let locationButton = document.createElement("button");

  let fullNameData = document.createTextNode(userObject.fullname);
  let emailData = document.createTextNode(userObject.email);
  let numberData = document.createTextNode(userObject.contactnumber);
  let emailStatusData = document.createTextNode(userObject.verified);
  let documentUrl = userObject.profilePictureUrl;
  let documentData = document.createTextNode("VIEW");
  let approveData = document.createTextNode("APPROVE");
  let rejectData = document.createTextNode("REJECT");
  let terminateData = document.createTextNode("TERMINATE");
  let locationData = document.createTextNode("LOCATION");

  documentButton.appendChild(documentContent);
  documentContent.appendChild(documentData);
  approveButton.appendChild(approveData);
  rejectButton.appendChild(rejectData);
  terminateButton.appendChild(terminateData);
  locationButton.appendChild(locationData);

  row.setAttribute("id", "row" + index);
  documentButton.setAttribute("href", documentUrl);
  documentButton.setAttribute("target", "_blank");
  approveButton.setAttribute(
    "onclick",
    'confirmationForm("approve","' + userId + '",' + index + ")"
  );
  rejectButton.setAttribute(
    "onclick",
    'confirmationForm("remove","' + userId + '",' + index + ")"
  );
  terminateButton.setAttribute(
    "onclick",
    'confirmationForm("remove","' + userId + '",' + index + ")"
  );
  locationButton.setAttribute("key", index);
  locationButton.setAttribute("onclick", "viewLocation(" + index + ")");

  let dataArray = [];

  if (dataQuery == "PendCust" || dataQuery == "PendMech") {
    dataArray = [
      fullNameData,
      emailData,
      numberData,
      emailStatusData,
      documentButton,
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
      documentButton,
      terminateButton,
    ];
  }
  if (dataQuery == "PendSO") {
    dataArray = [
      fullNameData,
      emailData,
      numberData,
      emailStatusData,
      documentButton,
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
      documentButton,
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

      let userEmail = obj.email;
      let userId;

      dataRef
        .orderByChild("email")
        .equalTo(userEmail)
        .on("value", (snapshot) => {
          snapshot.forEach((child) => {
            userId = child.key;
          });
        });

      if (dataQuery == "PendCust") {
        if (obj.usertype == "Customer" && obj.approved == false)
          createRow(obj, index, userId);
      }
      if (dataQuery == "ApprCust") {
        if (obj.usertype == "Customer" && obj.approved == true)
          createRow(obj, index, userId);
      }
      if (dataQuery == "PendMech") {
        if (obj.usertype == "Mechanic" && obj.approved == false)
          createRow(obj, index, userId);
      }
      if (dataQuery == "ApprMech") {
        if (obj.usertype == "Mechanic" && obj.approved == true)
          createRow(obj, index, userId);
      }
      if (dataQuery == "PendSO") {
        if (obj.usertype == "Repair Shop" && obj.approved == false)
          createRow(obj, index, userId);
      }
      if (dataQuery == "ApprSO") {
        if (obj.usertype == "Repair Shop" && obj.approved == true)
          createRow(obj, index, userId);
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
