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

const DATABASE = firebase.database();
const ADMINREF = DATABASE.ref("admins");

let dataTable = document.getElementById("table-content");
let adminData = [];

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
}

if (adminRole == "admin L3") {
  approvedUsers.remove();
  adminUsers.remove();
}

// Function for Retrieving Admin Data
let GetAdminData = async () => {
  adminData = [];
  while (dataTable.hasChildNodes()) {
    dataTable.removeChild(dataTable.firstChild);
  }
  try {
    const adminSnapshot = await ADMINREF.once("value");
    let adminKeys = Object.keys(adminSnapshot.val());
    console.log(adminKeys);
    let adminValues = adminSnapshot.val();
    for (let i = 0; i <= adminKeys[adminKeys.length - 1]; i++) {
      if (adminKeys.includes(i.toString())) {
        adminData.push(adminValues[i]);
      } else adminData.push(undefined);
    }
    LoadTableRows();
  } catch (error) {
    console.error("Error Retriveving Admin Data : ", error);
  }
};

// Function for Creating Rows in the Table
let LoadTableRows = async () => {
  let userRef = DATABASE.ref("users");
  let userSnapshot = await userRef.once("value");
  let userData = Object.values(userSnapshot.val());
  for (let i = 0; i < adminData.length; i++) {
    if (adminData[i]) {
      let adminFullName;
      for (let j = 0; j < userData.length; j++) {
        if (userData[j].email == adminData[i].username) {
          adminFullName = userData[j].fullname;
        }
      }
      let row = document.createElement("tr");
      let checkBoxItem = document.createElement("th");
      let emailItem = document.createElement("th");
      let roleItem = document.createElement("th");
      let fullnameItem = document.createElement("th");
      let checkBoxText = document.createElement("input");
      let emailText = document.createTextNode(adminData[i].username);
      let roleText = document.createTextNode(adminData[i].role);
      let fullnameText = document.createTextNode(adminFullName);

      checkBoxText.id = "adminCheckBox" + i;
      checkBoxText.type = "checkbox";
      checkBoxItem.addEventListener("change", (e) => {
        checkBoxChecked(e);
      });
      checkBoxItem.appendChild(checkBoxText);
      emailItem.appendChild(emailText);
      fullnameItem.appendChild(fullnameText);
      roleItem.appendChild(roleText);
      row.appendChild(checkBoxItem);
      row.appendChild(emailItem);
      row.appendChild(fullnameItem);
      row.appendChild(roleItem);
      dataTable.appendChild(row);
    }
  }
};

// Top Right Buttons Controllers
let pageContainer = document.getElementById("pageContainer");
let createButton = document.getElementById("createButton");
let updateButton = document.getElementById("updateButton");
let deleteButton = document.getElementById("deleteButton");
let auditLogsButton = document.getElementById("auditLogs");

createButton.style.marginRight = "10px";
updateButton.style.marginRight = "10px";
deleteButton.style.marginRight = "10px";
updateButton.style.color = "gray";
deleteButton.style.color = "gray";
auditLogsButton.style.color = "gray";

createButton.style.cursor = "pointer";
createButton.onclick = createWindow;

async function createWindow() {
  const usersRef = DATABASE.ref("users");
  const usersSnapshot = await usersRef.once("value");
  let usersData = usersSnapshot.val();
  usersData = Object.values(usersData);
  let usersEmails = [];
  let usersType = [];
  let usersFullname = [];
  let adminEmails = [];
  for (i = 0; i < adminData.length; i++) {
    if (adminData[i]) adminEmails.push(adminData[i].username);
  }

  for (i = 0; i < usersData.length; i++) {
    if (!adminEmails.includes(usersData[i].email)) {
      usersEmails.push(usersData[i].email);
      usersType.push(usersData[i].usertype);
      usersFullname.push(usersData[i].fullname);
    }
  }

  let roleRef = DATABASE.ref("roles");
  let roleSnapshot = await roleRef.once("value");
  let roleData = Object.values(roleSnapshot.val());

  let createWindowContainer = document.createElement("div");
  let createWindowBackground = document.createElement("div");
  let createWindowNameContainer = document.createElement("div");
  let createWindowEmailContainer = document.createElement("div");
  let createWindowRoleContainer = document.createElement("div");
  let createWindowNameField = document.createElement("input");
  let createWindowNameLabel = document.createTextNode("Name:");
  let createWindowEmailField = document.createElement("select");
  let createWindowEmailLabel = document.createTextNode("Email:");
  let createWindowRoleField = document.createElement("select");
  let createWindowRoleLabel = document.createTextNode("Role:");
  let createWindowRoleDescContainer = document.createElement("div");
  let createWindowRoleDescField = document.createElement("input");
  let createWindowRoleDescLabel = document.createTextNode("Description:");

  createWindowEmailField.onchange = selectEmail;
  createWindowRoleField.onchange = selectRole;
  createWindowContainer.id = "createWindowContainer";
  createWindowEmailField.id = "emailField";
  createWindowNameField.id = "nameField";
  createWindowRoleField.id = "roleNameField";
  createWindowRoleDescField.id = "roleDescField";
  createWindowNameField.disabled = true;
  createWindowRoleDescField.disabled = true;
  createWindowContainer.style.gridArea = "overlap";
  createWindowContainer.style.zIndex = "99";
  createWindowContainer.style.height = "100vh";
  createWindowContainer.style.width = "100vw";
  createWindowContainer.style.display = "flex";
  createWindowContainer.style.alignItems = "center";
  createWindowContainer.style.justifyContent = "center";
  createWindowBackground.style.display = "flex";
  createWindowBackground.style.flexDirection = "column";
  createWindowBackground.style.width = "500px";
  createWindowBackground.style.height = "250px";
  createWindowBackground.style.backgroundColor = "black";
  createWindowBackground.style.borderRadius = "10px";
  createWindowBackground.style.padding = "20px";
  createWindowBackground.style.justifyContent = "center";
  createWindowNameContainer.style.display = "flex";
  createWindowNameContainer.style.width = "100%";
  createWindowNameContainer.style.justifyContent = "space-between";
  createWindowNameContainer.style.marginBottom = "5px";
  createWindowNameContainer.style.paddingRight = "20px";
  createWindowNameContainer.style.paddingLeft = "20px";
  createWindowEmailContainer.style.display = "flex";
  createWindowEmailContainer.style.width = "100%";
  createWindowEmailContainer.style.justifyContent = "space-between";
  createWindowEmailContainer.style.marginBottom = "5px";
  createWindowEmailContainer.style.paddingRight = "20px";
  createWindowEmailContainer.style.paddingLeft = "20px";
  createWindowRoleContainer.style.display = "flex";
  createWindowRoleContainer.style.width = "100%";
  createWindowRoleContainer.style.justifyContent = "space-between";
  createWindowRoleContainer.style.marginBottom = "5px";
  createWindowRoleContainer.style.paddingRight = "20px";
  createWindowRoleContainer.style.paddingLeft = "20px";
  createWindowRoleDescContainer.style.display = "flex";
  createWindowRoleDescContainer.style.width = "100%";
  createWindowRoleDescContainer.style.justifyContent = "space-between";
  createWindowRoleDescContainer.style.marginBottom = "5px";
  createWindowRoleDescContainer.style.paddingRight = "20px";
  createWindowRoleDescContainer.style.paddingLeft = "20px";

  let createWindowButtonContainer = document.createElement("div");
  let createWindowCreateButton = document.createElement("div");
  let createWindowCreateText = document.createTextNode("CREATE");
  let createWindowCancelButton = document.createElement("div");
  let createWindowCancelText = document.createTextNode("CANCEL");

  createWindowButtonContainer.style.marginTop = "20px";
  createWindowButtonContainer.style.display = "flex";
  createWindowButtonContainer.style.width = "100%";
  createWindowButtonContainer.style.justifyContent = "space-around";
  createWindowCreateButton.style.cursor = "pointer";
  createWindowCancelButton.style.cursor = "pointer";
  createWindowCreateButton.onclick = createCreateWindow;
  createWindowCancelButton.onclick = cancelCreateWindow;

  createWindowNameContainer.appendChild(createWindowNameLabel);
  createWindowNameContainer.appendChild(createWindowNameField);
  createWindowEmailContainer.appendChild(createWindowEmailLabel);
  createWindowEmailContainer.appendChild(createWindowEmailField);
  createWindowRoleContainer.appendChild(createWindowRoleLabel);
  createWindowRoleContainer.appendChild(createWindowRoleField);
  createWindowRoleDescContainer.appendChild(createWindowRoleDescLabel);
  createWindowRoleDescContainer.appendChild(createWindowRoleDescField);
  createWindowCreateButton.appendChild(createWindowCreateText);
  createWindowCancelButton.appendChild(createWindowCancelText);
  createWindowButtonContainer.appendChild(createWindowCreateButton);
  createWindowButtonContainer.appendChild(createWindowCancelButton);

  for (let i = 0; i < usersEmails.length; i++) {
    if (i == 0) {
      let blankText = document.createTextNode("");
      let blankOption = document.createElement("option");
      blankOption.value = "";
      blankOption.appendChild(blankText);
      createWindowEmailField.appendChild(blankOption);
    }
    let emailText = document.createTextNode(usersEmails[i]);
    let emailOption = document.createElement("option");
    emailOption.value = usersEmails[i];
    emailOption.appendChild(emailText);
    createWindowEmailField.appendChild(emailOption);
  }

  for (let i = 0; i < roleData.length; i++) {
    if (i == 0) {
      let blankText = document.createTextNode("");
      let blankOption = document.createElement("option");
      blankOption.value = "";
      blankOption.appendChild(blankText);
      createWindowRoleField.appendChild(blankOption);
    }
    let roleText = document.createTextNode(roleData[i].name);
    let roleOption = document.createElement("option");
    roleOption.value = roleData[i].name;
    roleOption.appendChild(roleText);
    createWindowRoleField.appendChild(roleOption);
  }
  createWindowEmailField.style.width = "182.88px";
  createWindowEmailField.style.height = "25.19px";
  createWindowRoleField.style.width = "182.88px";
  createWindowRoleField.style.height = "25.19px";
  createWindowBackground.appendChild(createWindowEmailContainer);
  createWindowBackground.appendChild(createWindowNameContainer);
  createWindowBackground.appendChild(createWindowRoleContainer);
  createWindowBackground.appendChild(createWindowRoleDescContainer);
  createWindowBackground.appendChild(createWindowButtonContainer);
  createWindowContainer.appendChild(createWindowBackground);
  pageContainer.appendChild(createWindowContainer);
}

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

let createCreateWindow = async () => {
  let adminUsernameField = document.getElementById("emailField");
  let adminRoleField = document.getElementById("roleNameField");
  let adminUsername = adminUsernameField.value;
  let adminRole = adminRoleField.value;
  if (adminUsername && adminRole) {
    let createAdminRef = DATABASE.ref("admins/" + adminData.length);
    let createAdminData = {
      username: adminUsername,
      role: adminRole,
      logs: {
        0: {
          action: "Create",
          timestamp: displayTime(),
        },
      },
    };
    await createAdminRef.set(createAdminData);
    cancelCreateWindow();
    GetAdminData();
  }
};

let cancelCreateWindow = () => {
  let createWindowContainer = document.getElementById("createWindowContainer");
  createWindowContainer.remove();
};

async function updateWindow() {
  let updateWindowContainer = document.createElement("div");
  let updateWindowBackground = document.createElement("div");
  let updateWindowUsernameContainer = document.createElement("div");
  let updateWindowFullnameContainer = document.createElement("div");
  let updateWindowRoleNameContainer = document.createElement("div");
  let updateWindowRoleDescContainer = document.createElement("div");
  let updateWindowUsernameField = document.createElement("input");
  let updaetWindowUsernameLabel = document.createTextNode("Email:");
  let updateWindowFullnameField = document.createElement("input");
  let updateWindowFullnameLabel = document.createTextNode("Name:");
  let updateWindowRoleNameField = document.createElement("select");
  let updateWindowRoleNameLabel = document.createTextNode("Role:");
  let updateWindowRoleDescField = document.createElement("input");
  let updateWindowRoleDescLabel = document.createTextNode("Description:");
  let updateWindowButtonContainer = document.createElement("div");
  let updateWindowUpdateButton = document.createElement("div");
  let updateWindowUpdateText = document.createTextNode("UPDATE");
  let updateWindowCancelButton = document.createElement("div");
  let updateWindowCancelText = document.createTextNode("CANCEL");

  let updateUpdateCancel = () => {
    updateWindowContainer.remove();
  };

  let updateUpdateWindow = async () => {
    let adminForUpdateIndex = itemSelected.slice(13);
    let adminForUpdateRef = DATABASE.ref("admins/" + adminForUpdateIndex);
    let adminLogSnapshot = await adminForUpdateRef.once("value");
    let adminLogData = adminLogSnapshot.val();
    adminLogData = adminLogData.logs;
    console.log(adminLogData);
    adminLogData[adminLogData.length] = {
      action: "Role Update",
      timestamp: displayTime(),
    };
    let adminForUpdateData = {
      logs: adminLogData,
      username: updateWindowUsernameField.value,
      role: updateWindowRoleNameField.value,
    };
    adminForUpdateRef.set(adminForUpdateData);
    updateUpdateCancel();
    GetAdminData();
    itemSelected = "";
  };

  updateWindowUsernameContainer.appendChild(updaetWindowUsernameLabel);
  updateWindowUsernameContainer.appendChild(updateWindowUsernameField);
  updateWindowFullnameContainer.appendChild(updateWindowFullnameLabel);
  updateWindowFullnameContainer.appendChild(updateWindowFullnameField);
  updateWindowRoleNameContainer.appendChild(updateWindowRoleNameLabel);
  updateWindowRoleNameContainer.appendChild(updateWindowRoleNameField);
  updateWindowRoleDescContainer.appendChild(updateWindowRoleDescLabel);
  updateWindowRoleDescContainer.appendChild(updateWindowRoleDescField);
  updateWindowBackground.appendChild(updateWindowUsernameContainer);
  updateWindowBackground.appendChild(updateWindowFullnameContainer);
  updateWindowBackground.appendChild(updateWindowRoleNameContainer);
  updateWindowBackground.appendChild(updateWindowRoleDescContainer);
  updateWindowContainer.appendChild(updateWindowBackground);
  updateWindowUpdateButton.appendChild(updateWindowUpdateText);
  updateWindowCancelButton.appendChild(updateWindowCancelText);
  updateWindowButtonContainer.appendChild(updateWindowUpdateButton);
  updateWindowButtonContainer.appendChild(updateWindowCancelButton);
  updateWindowBackground.appendChild(updateWindowButtonContainer);
  pageContainer.appendChild(updateWindowContainer);

  updateWindowRoleNameField.onchange = selectRole;
  updateWindowContainer.id = "createWindowContainer";
  updateWindowUsernameField.id = "usernameField";
  updateWindowFullnameField.id = "fullnameField";
  updateWindowRoleNameField.id = "roleNameField";
  updateWindowRoleDescField.id = "roleDescField";
  updateWindowUsernameField.disabled = true;
  updateWindowFullnameField.disabled = true;
  updateWindowRoleDescField.disabled = true;
  updateWindowRoleNameField.style.width = "182.88px";
  updateWindowRoleNameField.style.height = "25.19px";
  updateWindowContainer.style.gridArea = "overlap";
  updateWindowContainer.style.zIndex = "99";
  updateWindowContainer.style.height = "100vh";
  updateWindowContainer.style.width = "100vw";
  updateWindowContainer.style.display = "flex";
  updateWindowContainer.style.alignItems = "center";
  updateWindowContainer.style.justifyContent = "center";
  updateWindowBackground.style.display = "flex";
  updateWindowBackground.style.flexDirection = "column";
  updateWindowBackground.style.width = "500px";
  updateWindowBackground.style.height = "250px";
  updateWindowBackground.style.backgroundColor = "black";
  updateWindowBackground.style.borderRadius = "10px";
  updateWindowBackground.style.padding = "20px";
  updateWindowBackground.style.justifyContent = "center";
  updateWindowUsernameContainer.style.display = "flex";
  updateWindowUsernameContainer.style.width = "100%";
  updateWindowUsernameContainer.style.justifyContent = "space-between";
  updateWindowUsernameContainer.style.marginBottom = "5px";
  updateWindowUsernameContainer.style.paddingRight = "20px";
  updateWindowUsernameContainer.style.paddingLeft = "20px";
  updateWindowFullnameContainer.style.display = "flex";
  updateWindowFullnameContainer.style.width = "100%";
  updateWindowFullnameContainer.style.justifyContent = "space-between";
  updateWindowFullnameContainer.style.marginBottom = "5px";
  updateWindowFullnameContainer.style.paddingRight = "20px";
  updateWindowFullnameContainer.style.paddingLeft = "20px";
  updateWindowRoleNameContainer.style.display = "flex";
  updateWindowRoleNameContainer.style.width = "100%";
  updateWindowRoleNameContainer.style.justifyContent = "space-between";
  updateWindowRoleNameContainer.style.marginBottom = "5px";
  updateWindowRoleNameContainer.style.paddingRight = "20px";
  updateWindowRoleNameContainer.style.paddingLeft = "20px";
  updateWindowRoleDescContainer.style.display = "flex";
  updateWindowRoleDescContainer.style.width = "100%";
  updateWindowRoleDescContainer.style.justifyContent = "space-between";
  updateWindowRoleDescContainer.style.marginBottom = "5px";
  updateWindowRoleDescContainer.style.paddingRight = "20px";
  updateWindowRoleDescContainer.style.paddingLeft = "20px";
  updateWindowButtonContainer.style.marginTop = "20px";
  updateWindowButtonContainer.style.display = "flex";
  updateWindowButtonContainer.style.width = "100%";
  updateWindowButtonContainer.style.justifyContent = "space-around";
  updateWindowUpdateButton.style.cursor = "pointer";
  updateWindowCancelButton.style.cursor = "pointer";
  updateWindowUpdateButton.onclick = updateUpdateWindow;
  updateWindowCancelButton.onclick = updateUpdateCancel;

  let userRef = DATABASE.ref("users");
  let userSnapshot = await userRef.once("value");
  let userData = Object.values(userSnapshot.val());
  let userFullname = [];
  let userEmail = [];
  let updateAdminData = adminData[itemSelected.slice(13)];
  let rolesRef = DATABASE.ref("roles");
  let rolesSnapshot = await rolesRef.once("value");
  let rolesData = Object.values(rolesSnapshot.val());
  let selectedRoleIndex;
  let selectedRoleDesc;
  let roleNames = [];
  let roleDesc = [];

  for (let i = 0; i < userData.length; i++) {
    userFullname.push(userData[i].fullname);
    userEmail.push(userData[i].email);
  }

  let userIndex = userEmail.indexOf(updateAdminData.username);

  for (let i = 0; i < rolesData.length; i++) {
    let roleOption = document.createElement("option");
    let roleText = document.createTextNode(rolesData[i].name);
    roleOption.appendChild(roleText);
    roleOption.value = rolesData[i].name;
    updateWindowRoleNameField.appendChild(roleOption);
    roleNames.push(rolesData[i].name);
    roleDesc.push(rolesData[i].description);
  }

  selectedRoleIndex = roleNames.indexOf(updateAdminData.role);
  selectedRoleDesc = roleDesc[selectedRoleIndex];

  updateWindowUsernameField.value = updateAdminData.username;
  updateWindowFullnameField.value = userFullname[userIndex];
  updateWindowRoleNameField.value = updateAdminData.role;
  updateWindowRoleDescField.value = selectedRoleDesc;
}

let selectEmail = async () => {
  let emailField = document.getElementById("emailField");
  let emailVal = emailField.value;
  let usersRef = DATABASE.ref("users");
  let usersSnapshot = await usersRef.once("value");
  let usersData = usersSnapshot.val();
  usersData = Object.values(usersData);
  let userEmails = [];
  for (let i = 0; i < usersData.length; i++) {
    userEmails[i] = usersData[i].email;
  }
  let nameField = document.getElementById("nameField");
  let index = userEmails.indexOf(emailVal);
  let nameVal;
  if (emailVal) {
    nameVal = usersData[index].fullname;
  } else {
    nameVal = "";
  }
  nameField.value = nameVal;
};

let selectRole = async () => {
  let roleNameField = document.getElementById("roleNameField");
  let roleDescField = document.getElementById("roleDescField");
  let roleRef = DATABASE.ref("roles");
  let roleSnapshot = await roleRef.once("value");
  let roleData = Object.values(roleSnapshot.val());
  let roleName = [];
  let roleDesc = [];
  for (let i = 0; i < roleData.length; i++) {
    roleName.push(roleData[i].name);
    roleDesc.push(roleData[i].description);
  }
  let index = roleName.indexOf(roleNameField.value);
  roleDescField.value = roleDesc[index];
};

let deleteRecord = async () => {
  try {
    const deleteAdminRef = DATABASE.ref("admins/" + itemSelected.slice(13));
    deleteAdminRef.remove();
    GetAdminData();
  } catch (error) {
    console.error("Error Deleting Record : ", error.code, error.message);
  }
};

let confirmationMessage = async () => {
  let confirmationContainer = document.createElement("div");
  let confirmationBackground = document.createElement("div");
  let confirmationTextContainer = document.createElement("div");
  let confirmationText = document.createTextNode(
    "Kindly confirm if you want to delete the user."
  );
  let confirmationButtonContainer = document.createElement("div");
  let proceedButton = document.createElement("div");
  let proceedText = document.createTextNode("PROCEED");
  let cancelButton = document.createElement("div");
  let cancelText = document.createTextNode("CANCEL");
  let pageContainer = document.getElementById("pageContainer");

  pageContainer.appendChild(confirmationContainer);
  confirmationContainer.appendChild(confirmationBackground);
  confirmationBackground.appendChild(confirmationTextContainer);
  confirmationTextContainer.appendChild(confirmationText);
  confirmationBackground.appendChild(confirmationButtonContainer);
  confirmationButtonContainer.appendChild(proceedButton);
  proceedButton.appendChild(proceedText);
  confirmationButtonContainer.appendChild(cancelButton);
  cancelButton.appendChild(cancelText);

  confirmationContainer.style.gridArea = "overlap";
  confirmationContainer.style.zIndex = "100";
  confirmationContainer.style.height = "100vh";
  confirmationContainer.style.width = "100vw";
  confirmationContainer.style.display = "flex";
  confirmationContainer.style.alignItems = "center";
  confirmationContainer.style.justifyContent = "center";
  confirmationBackground.style.display = "flex";
  confirmationBackground.style.flexDirection = "column";
  confirmationBackground.style.width = "600px";
  confirmationBackground.style.height = "150px";
  confirmationBackground.style.backgroundColor = "black";
  confirmationBackground.style.borderRadius = "10px";
  confirmationBackground.style.padding = "20px";
  confirmationBackground.style.justifyContent = "space-around";
  confirmationBackground.style.alignItems = "center";
  confirmationTextContainer.style.fontSize = "20px";
  confirmationButtonContainer.style.fontSize = "20px";
  confirmationButtonContainer.style.display = "flex";
  confirmationButtonContainer.style.width = "40%";
  confirmationButtonContainer.style.justifyContent = "space-between";
  confirmationButtonContainer.style.alignItems = "center";
  proceedButton.style.cursor = "pointer";
  cancelButton.style.cursor = "pointer";

  let proceedConfirmation = () => {
    confirmationContainer.remove();
    deleteRecord();
  };

  let cancelConfirmation = () => {
    confirmationContainer.remove();
  };

  proceedButton.onclick = proceedConfirmation;
  cancelButton.onclick = cancelConfirmation;
};

let auditRoute = () => {
  window.location.href =
    "./AuditLogs.html?user-role=" + adminRole + "&data=" + itemSelected;
};

// Check Box Controllers
let anItemIsSelected = false;
let itemSelected = "";

let checkBoxChecked = (e) => {
  if (itemSelected == "") {
    itemSelected = e.target.id;
    updateButton.style.color = "white";
    deleteButton.style.color = "white";
    auditLogsButton.style.color = "white";
    updateButton.style.cursor = "pointer";
    deleteButton.style.cursor = "pointer";
    auditLogsButton.style.cursor = "pointer";
    updateButton.onclick = updateWindow;
    deleteButton.onclick = confirmationMessage;
    auditLogsButton.onclick = auditRoute;
  } else {
    let temp = itemSelected;
    itemSelected = e.target.id;
    if (temp == itemSelected) {
      updateButton.style.color = "gray";
      deleteButton.style.color = "gray";
      auditLogsButton.style.color = "gray";
      updateButton.style.cursor = "default";
      deleteButton.style.cursor = "default";
      auditLogsButton.style.cursor = "default";
      updateButton.onclick = undefined;
      deleteButton.onclick = undefined;
      auditLogsButton.onclick = undefined;
      itemSelected = "";
    } else {
      document.getElementById(temp).checked = false;
      itemSelected = e.target.id;
    }
  }
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

GetAdminData();
