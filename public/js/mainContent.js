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
  if (action == "remove" || action == "terminate") {
    let rejectionMessageContainer = document.createElement("div");
    let rejectionMessage = document.createElement("textarea");
    let rejectionReason = document.createTextNode("Reason:");
    rejectionMessage.id = "rejectionMessage";
    confirmationBackground.appendChild(rejectionMessageContainer);
    rejectionMessageContainer.appendChild(rejectionReason);
    rejectionMessageContainer.appendChild(rejectionMessage);
    confirmationButtonConfirm.setAttribute(
      "onclick",
      'removeData("' + userIdRef + '", ' + index + ", " + '"' + action + '")'
    );
    rejectionMessageContainer.style.display = "flex";
    rejectionMessageContainer.style.flexDirection = "column";
  }

  confirmationBackground.appendChild(confirmationButtonContainer);
  confirmationButtonContainer.appendChild(confirmationButtonCancel);
  confirmationButtonContainer.appendChild(confirmationButtonConfirm);
};

//E-Mail Notification
let sendEmailNotification = (user, actionTaken) => {
  //UN: tapandrepairtar@gmail.com
  //PW: TARTARus;
  //Public Key : _WBdXTRXKLOJVxBJr
  (function () {
    emailjs.init("_WBdXTRXKLOJVxBJr");
  })();

  let emailParams;
  let rejectionMessage;

  if (actionTaken == "REJECTED" || actionTaken == "TERMINATED") {
    rejectionMessage = document.getElementById("rejectionMessage").value;
    emailParams = {
      To: user.email,
      Subject: "Your Account has been " + actionTaken,
      Body:
        "Your Account " +
        userEmail +
        " has been " +
        actionTaken +
        ". " +
        'Reason: "' +
        rejectionMessage +
        '". If you believe there has been a mistake, please reach out to our support team for further assistance. Best regards, The Tap and Repair Application Team.',
    };
  } else {
    emailParams = {
      To: user.email,
      Subject:
        "Complete Your Tap and Repair Account Verification to Get Started!",
      Body:
        "Hello " +
        user.fullname +
        ", \n\n Welcome aboard to Tap and Repair! \n\n Your registration has been thoroughly reviewed and approved by our administrators. To activate your account and unlock the full potential of Tap and Repair's exceptional features, please keep an eye on your inbox for the verification email we've just sent.\n\n This crucial step ensures the security of your account and grants you unfettered access to Tap and Repair's comprehensive suite of repair services. From managing repair requests seamlessly to exploring diverse service options and staying updated with personalized offerings, you'll have it all at your fingertips once you verify your email. \n\n Thank you for selecting Tap and Repair. For any queries or assistance required, our dedicated support team is available round the clock at [support@tapandrepair.com]. Your satisfaction is our utmost priority! \n\n Warm regards, \n Tap and Repair Team",
    };
  }

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
let removeData = async (userIdRef, index, removeAction) => {
  try {
    if (removeAction == "remove") removeAction = "REJECTED";
    if (removeAction == "terminate") removeAction = "TERMINATED";
    userIdRef = "users/" + userIdRef;
    userIdRef = database.ref(userIdRef);

    // Use an async function to await the data retrieval
    const snapshot = await userIdRef.once("value");
    const user = snapshot.val();

    // Perform the email notification, data removal, and other operations
    sendEmailNotification(user, removeAction);
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

    // Perform the email notification, data approval, and other operations
    sendEmailNotification(user, "APPROVED");
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
let viewDocument = (documents) => {
  closeViewConfirmation();

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
    "id",
    "initialDocumentTextContainer"
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
  let permit = documents.permit;
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
  } else if (dataQuery.includes("Mech")) {
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
  } else if (dataQuery.includes("SO")) {
    permitButton = document.createElement("button");
    idButton = document.createElement("button");
    selfyButton = document.createElement("button");
    permitButton.setAttribute("class", "viewDocumentButton");
    idButton.setAttribute("class", "viewDocumentButton");
    selfyButton.setAttribute("class", "viewDocumentButton");
    permitButton.setAttribute("onclick", "openDocument('" + permit + "')");
    idButton.setAttribute("onclick", "openDocument('" + id + "')");
    selfyButton.setAttribute("onclick", "openDocument('" + selfy + "')");
    permitText = document.createTextNode("Permit");
    idText = document.createTextNode("ID");
    selfyText = document.createTextNode("Selfie");
    viewDocumentContents.appendChild(permitButton);
    viewDocumentContents.appendChild(idButton);
    viewDocumentContents.appendChild(selfyButton);
    permitButton.appendChild(permitText);
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
    'confirmationForm("terminate","' + userId + '",' + index + ")"
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
    if (
      obj.usertype == "Customer" &&
      obj.approved == false &&
      obj.completed == true
    )
      createRow(obj, index, userId);
  }
  if (dataQuery == "ApprCust") {
    if (
      obj.usertype == "Customer" &&
      obj.approved == true &&
      obj.completed == true
    )
      createRow(obj, index, userId);
  }
  if (dataQuery == "PendMech") {
    if (
      obj.usertype == "Mechanic" &&
      obj.approved == false &&
      obj.completed == true
    )
      createRow(obj, index, userId);
  }
  if (dataQuery == "ApprMech") {
    if (
      obj.usertype == "Mechanic" &&
      obj.approved == true &&
      obj.completed == true
    )
      createRow(obj, index, userId);
  }
  if (dataQuery == "PendSO") {
    if (
      obj.usertype == "Repair Shop" &&
      obj.approved == false &&
      obj.completed == true
    )
      createRow(obj, index, userId);
  }
  if (dataQuery == "ApprSO") {
    if (
      obj.usertype == "Repair Shop" &&
      obj.approved == true &&
      obj.completed == true
    )
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
