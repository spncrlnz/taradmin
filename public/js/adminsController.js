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
let adminRef = database.ref("admins");
let adminData = [];
let tableParent = document.querySelector(".dataTable");
let selectedCheckBox;
let checkBoxSelected = false;
let createButton = document.getElementById("createButton");
let updateButton = document.getElementById("updateButton");
let deleteButton = document.getElementById("deleteButton");
let buttonMargin = "margin-left: 10px;";
createButton.setAttribute("style", buttonMargin + "cursor: pointer");
createButton.setAttribute("onclick", "createForm()");
updateButton.setAttribute("style", buttonMargin + "color: grey;");
deleteButton.setAttribute("style", buttonMargin + "color: grey;");
let updateContainer;
let ctr = 0;

let retrieveAdmins = async () => {
  try {
    const snapshot = await adminRef.once("value");
    adminData = snapshot.val();
    adminData = Object.values(adminData);
    if (adminData) {
      let index = 0;
      adminData.forEach((data) => {
        let row = document.createElement("tr");
        let checkBoxes = document.createElement("input");
        checkBoxes.setAttribute("type", "checkbox");
        checkBoxes.setAttribute("id", "checkbox" + index);
        checkBoxes.setAttribute("class", "checkbox");
        checkBoxes.addEventListener("change", (e) => {
          checkBoxTicked(e);
        });
        tableParent.appendChild(row);
        createRows(data, row, checkBoxes);
        index += 1;
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
    console.error("Error retrieving admin data: ", error.code, error.message);
  }
};

let createRows = async (data, row, checkBox) => {
  ctr += 1;
  let dataArray = [checkBox, data.username, data.fullname, data.roles];
  dataArray.forEach((element) => {
    if (element != checkBox) {
      let rowItem = document.createElement("th");
      row.appendChild(rowItem);
      let rowItemText = document.createTextNode(element);
      rowItem.appendChild(rowItemText);
    } else {
      let rowItem = document.createElement("th");
      row.appendChild(rowItem);
      rowItem.appendChild(checkBox);
    }
  });
};

let checkBoxTicked = (e) => {
  let id = e.target.id.toString();
  let index = id.charAt(id.length - 1);
  if (selectedCheckBox != document.getElementById(id)) {
    if (selectedCheckBox) {
      selectedCheckBox.checked = false;
      selectedCheckBox = document.getElementById(id);
    } else selectedCheckBox = document.getElementById(id);

    //Update Button
    updateButton.setAttribute(
      "style",
      buttonMargin + "color: white; cursor: pointer;"
    );
    updateButton.setAttribute("onclick", "updateForm(" + index + ")");
    deleteButton.setAttribute(
      "style",
      buttonMargin + "color: white; cursor: pointer;"
    );
    deleteButton.setAttribute("onclick", "deleteForm(" + index + ")");
  } else {
    selectedCheckBox = null;
    updateButton.setAttribute("style", buttonMargin + "color: grey;");
    deleteButton.setAttribute("style", buttonMargin + "color: grey;");
  }
};

let deleteForm = async (index) => {
  try {
    let adminRef = firebase.database().ref("admins/" + index);
    await adminRef.remove();
    let row = document.getElementById("checkbox" + index).parentNode.parentNode;
    row.remove();
  } catch (error) {
    console.error("Error on retrieving user data: ", error.code, error.message);
  }
};

let updateForm = async (index) => {
  try {
    let adminRef = firebase.database().ref("admins/" + index);
    let snapshot = await adminRef.once("value");
    let admin = snapshot.val();

    updateCreateForm(true, admin);
  } catch (error) {
    console.error("Error on retrieving user data: ", error.code, error.message);
  }
};

let createForm = () => {
  updateCreateForm(false);
};

let updateCreateForm = (updateAction, admin) => {
  let pageContainer = document.getElementById("pageContainer");
  updateContainer = document.createElement("div");
  let updateContainerStyle =
    "grid-area: overlap; height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center; color: black; z-index: 99";
  updateContainer.setAttribute("style", updateContainerStyle);
  let updateBackground = document.createElement("div");
  let updateBackgroundStyle =
    "background-color: #333; padding: 20px; height: fit-content; width: fit-content; border-radius: 10px; color: #e9ecef";
  updateBackground.setAttribute("style", updateBackgroundStyle);

  let fullNameSection = document.createElement("div");
  fullNameSection.setAttribute("class", "input-field");
  fullNameSection.setAttribute(
    "style",
    "display: flex; justify-content: space-between; margin-bottom: 10px"
  );
  let fullNameField = document.createElement("input");
  fullNameField.setAttribute("class", "input");
  fullNameField.setAttribute("id", "fullName");
  fullNameField.setAttribute("style", "margin-left: 20px");
  let fullNameLabel = document.createElement("label");
  fullNameLabel.setAttribute("for", "fullName");
  fullNameLabel.setAttribute("class", "fullName");
  let fullNameText = document.createTextNode("Full Name: ");
  fullNameLabel.appendChild(fullNameText);
  fullNameSection.appendChild(fullNameLabel);
  fullNameSection.appendChild(fullNameField);
  updateBackground.appendChild(fullNameSection);

  let usernameSection = document.createElement("div");
  usernameSection.setAttribute("class", "input-field");
  usernameSection.setAttribute(
    "style",
    "display: flex; justify-content: space-between"
  );
  let usernameField = document.createElement("input");
  usernameField.setAttribute("class", "input");
  usernameField.setAttribute("id", "username");
  usernameField.setAttribute("style", "margin-left: 20px");
  let usernameLabel = document.createElement("label");
  usernameLabel.setAttribute("for", "username");
  usernameLabel.setAttribute("class", "username");
  let usernameText = document.createTextNode("Email/Username: ");
  usernameLabel.appendChild(usernameText);
  usernameSection.appendChild(usernameLabel);
  usernameSection.appendChild(usernameField);
  updateBackground.appendChild(usernameSection);

  let buttonSection = document.createElement("div");
  buttonSection.setAttribute(
    "style",
    "display: flex; justify-content: space-around; margin-top: 40px; font-size: 20px"
  );
  let saveButton = document.createElement("div");
  saveButton.setAttribute("style", "cursor: pointer;");
  saveButton.setAttribute("onclick", "saveUpdateForm(" + updateAction + ")");
  let closeButton = document.createElement("div");
  closeButton.setAttribute("style", "cursor: pointer;");
  closeButton.setAttribute("onclick", "closeUpdateForm(updateContainer)");
  let saveText = document.createTextNode("SAVE");
  let closeText = document.createTextNode("CLOSE");
  saveButton.appendChild(saveText);
  closeButton.appendChild(closeText);
  buttonSection.appendChild(saveButton);
  buttonSection.appendChild(closeButton);
  updateBackground.appendChild(buttonSection);

  let inputSections = document.getElementsByClassName("input-field");

  updateContainer.appendChild(updateBackground);
  pageContainer.appendChild(updateContainer);

  if (updateAction) {
    fullNameField.setAttribute("readonly", "true");
    usernameField.setAttribute("readonly", "true");
    fullNameField.setAttribute("value", admin.fullname);
    usernameField.setAttribute("value", admin.username);
  }
};

let saveUpdateForm = (updateAction) => {
  if (!updateAction) {
    let ref = database.ref("admins/" + ctr);
    let usernameVal = document.getElementById("username").value;
    let fullnameVal = document.getElementById("fullName").value;
    let newAdmin = {
      fullname: fullnameVal,
      username: usernameVal,
    };
    ref.set(newAdmin);
    while (tableParent.firstChild) {
      tableParent.firstChild.remove();
    }
    ctr = 0;
    retrieveAdmins();
    closeUpdateForm();
  }
};

let closeUpdateForm = () => {
  updateContainer.remove();
};

let updateAdmin = async (ref, data) => {
  try {
    ref.set(data);
    console.log("Update Successful");
  } catch (error) {
    console.error("Error in updating user data: ", error.code, error.message);
  }
};

retrieveAdmins();
