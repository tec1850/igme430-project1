// Local variables
let truths = [];
let dares = [];

// Database variables
let truthsRef;
let daresRef;
let db;
let ref;

const userForm = document.querySelector('#userInputForm');
const inputRequest = (e) => updateRequest(e, userForm.getAttribute('method'), userForm.getAttribute('action'));

// Runs on windowLoad
function init() {
  let config = {
    apiKey: "AIzaSyAlit9BfDhfSNhKa7krJ_uWSl1U7Tibep4",
    authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://truth-or-dare-user-submissions.firebaseio.com/",
    storageBucket: "truth-or-dare-submissions.appspot.com"
  };

  firebase.initializeApp(config);
  db = firebase.database();
  ref = db.ref();

  truthsRef = ref.child("Truths");
  daresRef = ref.child("Dares");

  readInData();
  userForm.addEventListener('submit', inputRequest);
}

// Reads in input data from database
function readInData() {
  truthsRef.on("value", truthDataChanged, firebaseError);
  daresRef.on("value", dareDataChanged, firebaseError);
}

function truthDataChanged(data) {
  let obj = data.val();
  for (let key in obj) {
    let row = obj[key];
    truths.push(`${row.input}`);
  }
}

function dareDataChanged(data) {
  let obj = data.val();
  for (let key in obj) {
    let row = obj[key];
    dares.push(`${row.input}`);
  }
}

// Console logs any fire errors
function firebaseError(error) {
  console.log(error);
}

const parseJSON = (xhr, content) => {
  //parse response (obj will be empty in a 204 updated)
  const obj = JSON.parse(xhr.response);

  //if message in response, add to screen
  if (obj.message) {
    const p = document.createElement('p');
    p.textContent = `${obj.message}`;
    content.appendChild(p);
  }

  //if users in response, add to screen
  if (obj.inputs) {
    const inputList = document.createElement('p');
    const inputs = JSON.stringify(obj.inputs);
    inputList.textContent = inputs;
    content.appendChild(inputList);
  }
};

//function to handle our response
const handleResponse = (xhr) => {
  let valueField = "";
  if (document.getElementById("truthRadio").checked) valueField = "truth";
  else valueField = "dare";

  const content = document.querySelector('#response');
  const gameContent = document.querySelector('#game-content');

  //check the status code
  switch (xhr.status) {
    case 200: //success
      gameContent.innerHTML = `<b>Database loaded successfully.</b>`;
      break;
    case 201: //created
      content.innerHTML = `<b>Created: Added ${valueField} successfully.</b>`;
      break;
    case 204: //updated (no response back from server)
      content.innerHTML = `<b>Updated: ${valueField} already exists.</b>`;
      break;
    case 400: //bad request
      content.innerHTML = `<b>Bad Request: Input is required.</b>`;
      break;
    case 404: //if not found
      gameContent.innerHTML = `<b>Database resource not found.</b>`;
      break;
    default: //any other status code
      content.innerHTML = `Error code not implemented by client.`;
      break;
  }
};

const updateRequest = (e, method, action) => {
  const xhr = new XMLHttpRequest();

  xhr.open(method, action, true);

  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => handleResponse(xhr);

  if (method == "post") {
    const inputField = userForm.querySelector('#inputField');
    let valueField = "";

    if (document.getElementById("truthRadio").checked) valueField = "truth";
    else valueField = "dare";

    const formData = `input=${inputField.value}&value=${valueField}`;
    xhr.send(formData);

    document.getElementById("inputField").value = "";

    e.preventDefault();
    return false;
  }
  else {
    xhr.send();
  }
};

// Gets any random truth from read in database data and displays it
function getTruth() {
  if (truths.length == 0) {
    document.querySelector('#game-content').innerHTML = "No in truths the database!";
  }
  else {
    let rand = Math.floor(Math.random() * truths.length);
    document.querySelector('#game-content').innerHTML = truths[rand];
  }
}

// Gets any random dare from read in database data and displays it
function getDare() {
  if (dares.length == 0) {
    document.querySelector('#game-content').innerHTML = "No dares in the database!";
  }
  else {
    let rand = Math.floor(Math.random() * dares.length);
    document.querySelector('#game-content').innerHTML = dares[rand];
  }
}

// Handles user input "popup" for database contribution
function Popup() {
  let x = document.getElementById("database");
  document.getElementById("inputField").value = "";
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}