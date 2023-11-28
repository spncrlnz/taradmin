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

// Function for Retrieving Admin Data
let GetAdminData = async () => {
  adminData = [];
  while (dataTable.hasChildNodes()) {
    dataTable.removeChild(dataTable.firstChild);
  }
  try {
    const adminSnapshot = await ADMINREF.once("value");
    let adminKeys = Object.keys(adminSnapshot.val());
    let adminValues = adminSnapshot.val();
    for (let i = 0; i <= adminKeys[adminKeys.length - 1]; i++) {
      if (adminKeys.includes(i.toString())) {
        adminData.push(adminValues[i]);
      } else adminData.push(undefined);
    }
    console.log(adminData);
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

createButton.style.marginRight = "10px";
updateButton.style.marginRight = "10px";
updateButton.style.color = "gray";
deleteButton.style.color = "gray";

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
  createWindowRoleField.id = "roleField";
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

let createCreateWindow = async () => {
  let adminUsernameField = document.getElementById("emailField");
  let adminRoleField = document.getElementById("roleField");
  let adminUsername = adminUsernameField.value;
  let adminRole = adminRoleField.value;
  if (adminUsername && adminRole) {
    let createAdminRef = DATABASE.ref("admins/" + adminData.length);
    let createAdminData = {
      username: adminUsername,
      role: adminRole,
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
  let roleNameField = document.getElementById("roleField");
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

// Check Box Controllers
let anItemIsSelected = false;
let itemSelected = "";

let checkBoxChecked = (e) => {
  if (itemSelected == "") {
    itemSelected = e.target.id;
    updateButton.style.color = "white";
    deleteButton.style.color = "white";
    updateButton.style.cursor = "pointer";
    deleteButton.style.cursor = "pointer";
    deleteButton.setAttribute("onclick", "deleteRecord()");
  } else {
    let temp = itemSelected;
    itemSelected = e.target.id;
    if (temp == itemSelected) {
      updateButton.style.color = "gray";
      deleteButton.style.color = "gray";
      updateButton.style.cursor = "default";
      deleteButton.style.cursor = "default";
      deleteButton.setAttribute("onclick", "");
      itemSelected = "";
    } else {
      document.getElementById(temp).checked = false;
      itemSelected = e.target.id;
    }
  }
};

GetAdminData();
