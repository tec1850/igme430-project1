// --- Require ---
const http = require('http');
const url = require('url');
const query = require('querystring');
const admin = require('firebase-admin');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const mediaHandler = require('./mediaResponses.js');

// --- Handle Port ---
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// --- FireBase ---
const serviceAccount = require('../client/truth-or-dare-user-submissions-firebase-adminsdk-s7edj-28f3804bf6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://truth-or-dare-user-submissions.firebaseio.com',
});

// --- Variables ---
const db = admin.database();
const ref = db.ref();
const truthsRef = ref.child('Truths');
const daresRef = ref.child('Dares');
const truths = [];
const dares = [];

// --- Exports to jsonResponses---
module.exports.truthsDBRef = truthsRef;
module.exports.daresDBRef = daresRef;
module.exports.truthsList = truths;
module.exports.daresList = dares;

// Reads in firebase data
const handleFirebase = (request, response) => {
  const res = response;

  truthsRef.on('value', (snapshot) => {
    const obj = snapshot.val();
    Object.keys(obj).forEach((key) => {
      const row = obj[key];
      truths.push(`${row.input}`);
    });
    res.statusCode = 200;
  }, (errorObject) => {
    res.statusCode = errorObject.code;
    res.end();
  });

  daresRef.on('value', (snapshot) => {
    const obj = snapshot.val();
    Object.keys(obj).forEach((key) => {
      const row = obj[key];
      dares.push(`${row.input}`);
    });
    res.statusCode = 200;
  }, (errorObject) => {
    res.statusCode = errorObject.code;
    res.end();
  });
};

// --- Handles Posts ---
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addInput') {
    const res = response;
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addInput(request, res, bodyParams);
    });
  }
};

// --- Get Responses ---
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
    handleFirebase(request, response);
  } else if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/main.js') {
    htmlHandler.getJS(request, response);
  } else if (parsedUrl.pathname === '/ToDLogo.png') {
    mediaHandler.getLogo(request, response);
  } else if (parsedUrl.pathname === '/notReal') {
    jsonHandler.notFound(request, response);
  } else {
    jsonHandler.notFound(request, response);
  }
};

// --- Head Responses ---
const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getTruths') {
    jsonHandler.getInputsMeta(request, response);
  } else if (parsedUrl.pathname === '/getDares') {
    jsonHandler.getInputsMeta(request, response);
  } else if (parsedUrl.pathname === '/notReal') {
    jsonHandler.notFoundMeta(request, response);
  } else {
    jsonHandler.notFoundMeta(request, response);
  }
};

// --- Request (POST/HEAD) Responses ---
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);
