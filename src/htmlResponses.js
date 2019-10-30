const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const js = fs.readFileSync(`${__dirname}/../client/main.js`);
const firebase = fs.readFileSync(`${__dirname}/../client/init-firebase.js`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/js' });
  response.write(js);
  response.end();
};

const getFirebase = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/js' });
  response.write(firebase);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getJS,
  getFirebase,
};
