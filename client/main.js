
// Examples that will be replaced by Firebase later
let truths = [
  "Truth1",
  "Truth2",
  "Truth3"
];

let dares = [
  "Dare1",
  "Dare2",
  "Dare3"
];

function getTruth() {
  let rand = Math.floor(Math.random() * truths.length);
  document.querySelector('#game-content').innerHTML = truths[rand];
}

function getDare() {
  let rand = Math.floor(Math.random() * dares.length);
  document.querySelector('#game-content').innerHTML = dares[rand];
}

/*  ---- FIREBASE ----
  // Set the configuration for your app
  // TODO: Replace with your project's config object
  let config = {
    apiKey: "AIzaSyAlit9BfDhfSNhKa7krJ_uWSl1U7Tibep4",
    authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://truth-or-dare-user-submissions.firebaseio.com/",
    storageBucket: "truth-or-dare-submissions.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  let database = firebase.database();

  console.log(firebase); // verify that firebase is loaded by logging the global it created for us

  // #2 - refer to a root node named `scores`
  let ref = database.ref('scores');

 // #3 - create some data
  let data = {
  	name: "MADMAX",
    realName: "Maxine Mayfield",
    gameName: "Dig Dug",
  	score: 750200
  };

  // #4 - send data, in this case we are adding it to the `scores` node
  ref.push(data);
  */