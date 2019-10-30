const server = require('./server.js');

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getInputsMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

const addInput = (request, response, userInput) => {
  const truths = server.truthsList;
  const dares = server.daresList;

  const responseJSON = {
    message: 'A truth or dare input is required.',
  };

  if (!userInput.input) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if ((userInput.value === 'truth' && truths.includes(userInput.input)) || (userInput.value === 'dare' && dares.includes(userInput.input))) {
    responseCode = 204;
  }

  if (responseCode === 201) {
    responseJSON.message = 'Added Successfully';

    const data = {
      input: userInput.input,
      upvotes: 0,
      downvotes: 0,
    };

    if (userInput.value === 'truth') server.truthsDBRef.push(data);
    else server.daresDBRef.push(data);

    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  getInputsMeta,
  notFoundMeta,
  addInput,
  notFound,
};
