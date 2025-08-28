const { Given, When, Then } = require('@cucumber/cucumber');
const chai = require('chai');
const { faker } = require('@faker-js/faker');
const getLogger = require('../../../helpers/logger');
const logger = getLogger('CommonSteps');
const expect = chai.expect;
const API_Client = require('../../../helpers/request');
const endpoints = require('../../../test_data/endpoints.json');
const {  attachText  } = require('../../../helpers/reporting');
let url = "";
let queryParams = {};
let pathParams = {};
let payload = {};

let response;


Given('I set service api endpoint to {string}', async function (endpointKey) {
  url = ""
  if (!endpoints[endpointKey]) {
  logger.error(`Invalid endpoint key: "${endpointKey}"`);
  }
  
  url = url+endpoints[endpointKey];
  logger.debug("The reuested endpoint is: " + url);
});

Given('I set query params', async function (dataTable) {
  queryParams = {}; // Reset queryParams to avoid accumulation
  dataTable.rows().forEach(row => {
    const param = row[0];
    const value = row[1];
    queryParams[param] = value;
  });
  logger.debug("The query params are: " + JSON.stringify(queryParams));
});


Given('I set path params {string} with value {string}', async function (param, value) {
  pathParams = {}; 
  pathParams[param] = value;
  logger.debug("The path params are: " + JSON.stringify(pathParams));
});


Given('I set {string} payload', async function (usertype) {
  payload = {}; // Reset payload to avoid accumulation
  if (usertype === "valid") {
    payload = {
    email: "eve.holt@reqres.in",
    password: faker.internet.password()
  };
} else if (usertype === "invalid") {
    payload = {
      email: "sydney@fife"
      // password is intentionally missing to simulate invalid payload
    };
  } else {
    logger.error(`Unknown user type: ${usertype}`);
  }
  logger.debug("The payload is: " + JSON.stringify(payload));
});

When('I send GET HTTP request',{ timeout: 60000 },  async function () {
  response = await new API_Client().get(url, { pathParams, queryParams });
  logger.info("The get request to " + url + " is sent");
   url = "";
 queryParams = {};
 pathParams = {};
 payload = {};
});

When('I send POST HTTP request',{ timeout: 60000 },  async function () {
  response = await new API_Client().post(url, payload, { pathParams, queryParams });
  logger.info("The post request to " + url + " is sent");
  url = "";
 queryParams = {};
 pathParams = {};
 payload = {};
});

Then('I receive valid HTTP response code {string}', async function (expectedStatus) {
  logger.debug("The expected status code is: " + expectedStatus);
  logger.debug("The actual status code is: " + response.status);
  await attachText(this.attach, "Status code", true, expectedStatus, response.status)
  expect(response.status).to.equal(parseInt(expectedStatus));  
});

       
Then('Response should contain list of users', async function () {
  logger.debug("The response contains user list as: " + JSON.stringify(response.body.data));
    expect(response.body).to.have.property('data').that.is.an('array').that.is.not.empty;
});

Then('Response should match JSON schema {string}', async function (schemaFile) {
  const validator = require('../../../helpers/SchemaValidator');
  let schemaPath = "../../../schemas/" + schemaFile;
  let schema;
  try {
     schema = require(schemaPath);
  } catch (error) {
    logger.error(`Schema file ${schemaFile} not found or invalid.`);
  }

// Register schema
validator.registerSchema('userList', schema);

  //const validationresult = validator.validate('userList', response.body);
  expect(() => validator.validate('userList', response.body)).to.not.throw();
});

Then('Response should contain error message {string}', async function (string) {
           // Write code here that turns the phrase above into concrete actions
          logger.debug("The response contains error message as: " + JSON.stringify(response.body.error));
          expect(response.body).to.have.property('error').that.includes(string);
});
        
//module.exports = { url, queryParams, pathParams, response };