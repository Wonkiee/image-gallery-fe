/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import constants from './constants';

const { REQUEST_TYPES, RESPONSE_STATUS } = constants;

//TODO::GET URL FROM .ENV
export const SERVICE_URL = 'http://localhost:3201';

const performRequest = (method, path, data) => {
  const headers = {
    accept: 'application/json',
    'content-type': 'application/json'
  };
  const url = SERVICE_URL + path;
  return axios({
    method,
    headers,
    url,
    data,
  });
}

/**
 * Perform API Get request with given URL
 */
const get = async (path) => performRequest(REQUEST_TYPES.GET, path, null);

/**
 * Perform API Delete request with given URL
 */
const deleteRequest = async (path, data = null) => performRequest(REQUEST_TYPES.DELETE, path, data);

/**
 * Perform API Post request with given url and content data
 */
const post = async (path, data = null) => performRequest(REQUEST_TYPES.POST, path, data);

/**
 * Perform API put request with given URL
 */
const put = async (path, data = null) => performRequest(REQUEST_TYPES.PUT, path, data);

/**
 * Perform API Head request with given URL
 */
const head = async (path, data = null) => performRequest(REQUEST_TYPES.HEAD, path, data);

/**
 * Perform API patch request with given URL
 */
const patch = async (path, data = null) => performRequest(REQUEST_TYPES.PATCH, path, data);

export default {
  get,
  post,
  deleteRequest,
  put,
  patch,
  head,
  RESPONSE_STATUS,
  REQUEST_TYPES,
};
