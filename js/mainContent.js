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

// User Objects
let userObject = {
  approved: Boolean,
  booked: Boolean,
  contactnumber: String,
  documents: {
    cert: String,
    id: String,
    selfy: String,
  },
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

//Map Container
let closeMap = () => {
  let mapContainer = document.getElementById("mapContainer");
  mapContainer.remove();
};

//View Map Container 
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

//Approve or Reject User 
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

//E-Mail Notification
let sendEmailNotification = (userEmail, actionTaken) => {
  //UN: tapandrepairtar@gmail.com
  //PW: TARTARus;
  //Public Key : _WBdXTRXKLOJVxBJr
  (function () {
    emailjs.init("_WBdXTRXKLOJVxBJr");
  })();

  let emailParams = {
    To: userEmail,
    Subject: "Your Account has been " + actionTaken,
    Body:
      "Your Account " +
      userEmail +
      " has been " +
      actionTaken +
      ". " +
      "If you believe there has been a mistake, please reach out to our support team for further assistance. Best regards, The Tap and Repair Application Team.",
  };

  let serviceId = "service_ghy4wru";
  let templateId = "template_gfwlr6n";

  emailjs
    .send(serviceId, templateId, emailParams)
    .then((res) => {
      console.log(res);
    })
    .catch((res) => {
      console.error(res);
    });
};

//Removed User EMail Notification
let removeData = async (userIdRef, index) => {
  try {
    userIdRef = "users/" + userIdRef;
    userIdRef = database.ref(userIdRef);

    // Use an async function to await the data retrieval
    const snapshot = await userIdRef.once("value");
    const user = snapshot.val();
    const userEmail = user.email;

    // Perform the email notification, data removal, and other operations
    sendEmailNotification(userEmail, "REJECTED");
    await userIdRef.remove();

    let rowItem = document.getElementById("row" + index);
    rowItem.remove();

    removeConfirmationForm();
  } catch (error) {
    console.error("Error removing data:", error);
  }
};

//Approved User EMail Notification
let approveData = async (userIdRef, index) => {
  try {
    let userEmailRef = "users/" + userIdRef;
    userEmailRef = database.ref(userEmailRef);
    userIdRef = "users/" + userIdRef + "/approved";
    userIdRef = database.ref(userIdRef);

    // Use an async function to await the data retrieval
    const snapshot = await userEmailRef.once("value");
    const user = snapshot.val();
    const userEmail = user.email;

    // Perform the email notification, data approval, and other operations
    sendEmailNotification(userEmail, "APPROVED");
    await userIdRef.set(true);

    let rowItem = document.getElementById("row" + index);
    rowItem.remove();

    removeConfirmationForm();
  } catch (error) {
    console.error("Error approving data:", error);
  }
};

//Legal Documents Container
let closeDocument = () => {
  let viewDocumentContainer = document.getElementById("viewDocumentContainer");
  viewDocumentContainer.remove();
};

//Legal Documents Opener
let openDocument = (url) => {
  let initialDocumentTextContainer = document.getElementById(
    "initialDocumentTextContainer"
  );
  if (url == "") {
    initialDocumentTextContainer.innerHTML = "No Document Available";
  } else {
    let actualDocument = document.createElement("img");
    actualDocument.setAttribute("src", url);
    initialDocumentTextContainer.innerHTML = "";
    initialDocumentTextContainer.appendChild(actualDocument);
  }
};

//Legal Documents Opener
let viewDocument = (documents) => { closeViewConfirmation();
  
  let pageContainer = document.getElementById("pageContainer");
  let viewDocumentContainer = document.createElement("div");
  viewDocumentContainer.setAttribute("class", "viewDocumentContainer");
  viewDocumentContainer.setAttribute("id", "viewDocumentContainer");
  
  let viewDocumentBackground = document.createElement("div");
  viewDocumentBackground.setAttribute("class", "viewDocumentBackground");

  let viewDocumentContents = document.createElement("div");
  viewDocumentContents.setAttribute("class", "viewDocumentContents");
  
  let viewDocumentView = document.createElement("div");
  viewDocumentView.setAttribute("class", "viewDocumentView");
  
  let initialDocumentTextContainer = document.createElement("div");
  initialDocumentTextContainer.setAttribute(
    "id", "initialDocumentTextContainer"
  );
  
  let initialDocumentText = document.createTextNode(
    "Click the buttons to view documents."
  );
  
  let closeButton = document.createElement("button");
  closeButton.setAttribute("class", "viewDocumentCloseButton");
  
  let closeText = document.createTextNode("CLOSE");
  let cert = documents.cert;
  let id = documents.id;
  let selfy = documents.selfy;
  let certButton;
  let idButton;
  let selfyButton;

  if (dataQuery.includes("Cust")) {
    idButton = document.createElement("button");
    selfyButton = document.createElement("button");
    idText = document.createTextNode("ID");
    selfyText = document.createTextNode("Selfie");
    idButton.setAttribute("class", "viewDocumentButton");
    selfyButton.setAttribute("class", "viewDocumentButton");
    idButton.setAttribute("onclick", "openDocument('" + id + "')");
    selfyButton.setAttribute("onclick", "openDocument('" + selfy + "')");
    viewDocumentContents.appendChild(idButton);
    viewDocumentContents.appendChild(selfyButton);
    idButton.appendChild(idText);
    selfyButton.appendChild(selfyText);
  } else {
    certButton = document.createElement("button");
    idButton = document.createElement("button");
    selfyButton = document.createElement("button");
    certButton.setAttribute("class", "viewDocumentButton");
    idButton.setAttribute("class", "viewDocumentButton");
    selfyButton.setAttribute("class", "viewDocumentButton");
    certButton.setAttribute("onclick", "openDocument('" + cert + "')");
    idButton.setAttribute("onclick", "openDocument('" + id + "')");
    selfyButton.setAttribute("onclick", "openDocument('" + selfy + "')");
    certText = document.createTextNode("Certificate");
    idText = document.createTextNode("ID");
    selfyText = document.createTextNode("Selfie");
    viewDocumentContents.appendChild(certButton);
    viewDocumentContents.appendChild(idButton);
    viewDocumentContents.appendChild(selfyButton);
    certButton.appendChild(certText);
    idButton.appendChild(idText);
    selfyButton.appendChild(selfyText);
  }

  pageContainer.appendChild(viewDocumentContainer);
  viewDocumentContainer.appendChild(viewDocumentBackground);
  viewDocumentBackground.appendChild(viewDocumentContents);
  viewDocumentBackground.appendChild(viewDocumentView);
  viewDocumentView.appendChild(initialDocumentTextContainer);
  initialDocumentTextContainer.appendChild(initialDocumentText);
  viewDocumentBackground.appendChild(closeButton);
  closeButton.appendChild(closeText);
  closeButton.setAttribute("onclick", "closeDocument()");
};

//Close Button
let closeViewConfirmation = () => {
  let confirmationWindowContainer = document.getElementById(
    "confirmationWindowContainer"
  );
  confirmationWindowContainer.remove();
};

//Warning Message for Privacy
let viewConfirmation = (documents) => {
  let pageContainer = document.getElementById("pageContainer");
  let confirmationWindowContainer = document.createElement("div");
  let confirmationWindowBackground = document.createElement("div");
  let confirmationWindowContents = document.createElement("h2");
  let confirmationWindowText = document.createTextNode(
    "Warning, the document you are about to view is private and is only intended for administrators to see. Click 'PROCEED' if you wish to continue."
  );
  let closeConfirmationButtonRow = document.createElement("div");
  let closeConfirmationButtonProceed = document.createElement("h3");
  let closeConfirmationButtonCancel = document.createElement("h3");
  let closeConfirmationButtonProceedText = document.createTextNode("PROCEED");
  let closeConfirmationButtonCancelText = document.createTextNode("CANCEL");

  confirmationWindowContainer.setAttribute("id", "confirmationWindowContainer");
  confirmationWindowContainer.setAttribute(
    "class",
    "confirmationWindowContainer"
  );

  pageContainer.appendChild(confirmationWindowContainer);
  confirmationWindowContainer.appendChild(confirmationWindowBackground);
  confirmationWindowBackground.appendChild(confirmationWindowContents);
  confirmationWindowBackground.appendChild(closeConfirmationButtonRow);
  confirmationWindowContents.appendChild(confirmationWindowText);
  closeConfirmationButtonRow.appendChild(closeConfirmationButtonProceed);
  closeConfirmationButtonRow.appendChild(closeConfirmationButtonCancel);
  closeConfirmationButtonProceed.appendChild(
    closeConfirmationButtonProceedText
  );
  closeConfirmationButtonCancel.appendChild(closeConfirmationButtonCancelText);

  closeConfirmationButtonCancel.setAttribute(
    "onclick",
    "closeViewConfirmation()"
  );
  closeConfirmationButtonCancel.setAttribute(
    "class",
    "closeConfirmationButtonCancel"
  );
  closeConfirmationButtonCancel.setAttribute(
    "id",
    "closeConfirmationButtonCancel"
  );
  closeConfirmationButtonProceed.setAttribute(
    "class",
    "closeConfirmationButtonProceed"
  );
  closeConfirmationButtonProceed.setAttribute(
    "id",
    "closeConfirmationButtonProceed"
  );
  closeConfirmationButtonProceed.setAttribute(
    "onclick",
    "viewDocument(" + documents + ")"
  );
  confirmationWindowContainer.setAttribute(
    "class",
    "confirmationWindowContainer"
  );
  confirmationWindowBackground.setAttribute(
    "class",
    "confirmationWindowBackground"
  );
  confirmationWindowContents.setAttribute(
    "class",
    "confirmationWindowContents"
  );
  closeConfirmationButtonRow.setAttribute(
    "class",
    "closeConfirmationButtonRow"
  );
};

//Display Data Users
let createRow = (rowObject, index, userId) => {
  // FullName > Email > Number > Email-Status > Document > Reject > Approve
  userObject = rowObject;

  let parent = document.getElementById("table-content");

  let row = document.createElement("tr");
  let blankData = document.createTextNode("N/A");
  let trueData = document.createTextNode("Verified");
  let falseData = document.createTextNode("Not Verified");
  let documentButton = document.createElement("button");
  let approveButton = document.createElement("button");
  let rejectButton = document.createElement("button");
  let terminateButton = document.createElement("button");
  let locationButton = document.createElement("button");

  let fullNameData = document.createTextNode(userObject.fullname);
  let emailData = document.createTextNode(userObject.email);
  let numberData = document.createTextNode(userObject.contactnumber);
  let emailStatusData = document.createTextNode(userObject.verified);
  let userDocuments = userObject.documents;
  let documentData = document.createTextNode("VIEW");
  let approveData = document.createTextNode("APPROVE");
  let rejectData = document.createTextNode("REJECT");
  let terminateData = document.createTextNode("TERMINATE");
  let locationData = document.createTextNode("LOCATION");

  documentButton.appendChild(documentData);
  approveButton.appendChild(approveData);
  rejectButton.appendChild(rejectData);
  terminateButton.appendChild(terminateData);
  locationButton.appendChild(locationData);

  row.setAttribute("id", "row" + index);
  documentButton.setAttribute(
    "onclick",
    "viewConfirmation('" + JSON.stringify(userDocuments) + "')"
  );
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

//Fetching Data
let queryCreate = (obj, index, userId) => {
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
};

//Checking if there is Data Available
let checkRowCount = () => {
  let rowCount = 0;
  dataChildren.forEach((obj) => {
    if (dataQuery == "PendCust") {
      if (obj.usertype == "Customer" && obj.approved == false) rowCount += 1;
    }
    if (dataQuery == "ApprCust") {
      if (obj.usertype == "Customer" && obj.approved == true) rowCount += 1;
    }
    if (dataQuery == "PendMech") {
      if (obj.usertype == "Mechanic" && obj.approved == false) rowCount += 1;
    }
    if (dataQuery == "ApprMech") {
      if (obj.usertype == "Mechanic" && obj.approved == true) rowCount += 1;
    }
    if (dataQuery == "PendSO") {
      if (obj.usertype == "Repair Shop" && obj.approved == false) rowCount += 1;
    }
    if (dataQuery == "ApprSO") {
      if (obj.usertype == "Repair Shop" && obj.approved == true) rowCount += 1;
    }
  });
  return rowCount;
};

//No Data Found
let noDataFound = () => {
  let parent = document.getElementById("table-content");
  let row = document.createElement("tr");
  let item = document.createElement("th");
  let noDataText = document.createTextNode("No Data Found.");

  parent.appendChild(row);
  row.appendChild(item);
  item.appendChild(noDataText);
};

//Data Availability
retrieveData().then(() => {
  let rowCount = checkRowCount();
  let noDataBool = false;
  if (dataChildren) {
    dataChildren.forEach((obj, index) => {
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
      if (rowCount != 0) queryCreate(obj, index, userId);
      else {
        if (!noDataBool) {
          noDataFound();
          noDataBool = true;
        }
      }
    });
  } else {
    noDataFound();
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
