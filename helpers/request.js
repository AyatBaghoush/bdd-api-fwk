require('dotenv').config();
const request = require('supertest');
const getLogger = require('../helpers/logger');
const logger = getLogger('SuperTest');

class API_Client {
  constructor(defaultHeaders = {'x-api-key': process.env.API_KEY, 'Accept': process.env.ACCEPT}) {
    this.baseUrl = process.env.BASE_URL;
    if (!this.baseUrl) {
      throw new Error('BASE_URL is not defined in your .env file');
    }
    this.defaultHeaders = defaultHeaders;
  }

  _mergeHeaders(headers = {}) {
    return { ...this.defaultHeaders, ...headers };
  }

  _buildEndpoint(endpoint, pathParams = {}, queryParams = {}) {
  // Replace path parameters
  let finalEndpoint = endpoint;
  for (const [key, value] of Object.entries(pathParams)) {
    finalEndpoint = finalEndpoint.replace(`:${key}`, encodeURIComponent(value));
  }
   // Append query parameters
  const queryString = new URLSearchParams(queryParams).toString();
  console.log("queryString is:", queryString);
  if (queryString) {
    finalEndpoint += `?${queryString}`;
  }

  logger.debug("After replacing path params, endpoint is:", finalEndpoint);
 
  return finalEndpoint;
}


  async get(endpoint, { pathParams = {}, queryParams = {}, headers = {} } = {}) {
    logger.debug(`GET Request to ${endpoint} with pathParams: ${JSON.stringify(pathParams)}, queryParams: ${JSON.stringify(queryParams)}`);
    const finalEndpoint = this._buildEndpoint(endpoint, pathParams, queryParams);
    return request(this.baseUrl)
      .get(finalEndpoint)
      .query(queryParams)
      .set(this._mergeHeaders(headers));
  }

  async post(endpoint, body, { pathParams = {}, queryParams = {}, headers = {} } = {}) {
    logger.debug(`POST Request to ${endpoint} with pathParams: ${JSON.stringify(pathParams)}, queryParams: ${JSON.stringify(queryParams)}, body: ${JSON.stringify(body)}`);
    const finalEndpoint = this._buildEndpoint(endpoint, pathParams);
    return request(this.baseUrl)
      .post(finalEndpoint)
      .query(queryParams)
      .send(body)
      .set(this._mergeHeaders(headers));
  }

  async put(endpoint, { pathParams = {}, queryParams = {}, body = {}, headers = {} } = {}) {
    const finalEndpoint = this._buildEndpoint(endpoint, pathParams);
    return request(this.baseUrl)
      .put(finalEndpoint)
      .query(queryParams)
      .send(body)
      .set(this._mergeHeaders(headers));
  }

  async patch(endpoint, { pathParams = {}, queryParams = {}, body = {}, headers = {} } = {}) {
    const finalEndpoint = this._buildEndpoint(endpoint, pathParams);
    return request(this.baseUrl)
      .patch(finalEndpoint)
      .query(queryParams)
      .send(body)
      .set(this._mergeHeaders(headers));
  }

  async delete(endpoint, { pathParams = {}, queryParams = {}, headers = {} } = {}) {
    const finalEndpoint = this._buildEndpoint(endpoint, pathParams);
    return request(this.baseUrl)
      .delete(finalEndpoint)
      .query(queryParams)
      .set(this._mergeHeaders(headers));
  }

  setAuthHeader(key, value) {
    this.defaultHeaders[key] = value;
  }
}

module.exports = API_Client;
