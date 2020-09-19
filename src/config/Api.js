import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {getToken} from 'helpers/AsyncStorage';

const BASE_URL = 'https://dev.mover.az/api/worker/';

export const ApiClient = axios.create({
  baseURL: BASE_URL,
  validateStatus: (status) => status > 199 && status < 300,
  timeout: 5000,
});

export const API_ROUTES = {
  login: 'login',
  queueList: 'queue-list',
  startQueue: 'start-queue',
  queue: 'queue',
  activeQueue: 'active-queue',
  give: 'give',
  took: 'took',
  customerGone: 'customer-gone',
  settings: 'settings',
};

const notAuthRequiredUrls = ['login'];

ApiClient.interceptors.request.use(async (config) => {
  if (!notAuthRequiredUrls.includes(config.url)) {
    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

ApiClient.interceptors.response.use(
  function (response) {
    // console.log('response: ', response);
    // Do something with response data
    return response;
  },
  function (error) {
    let message = '';
    if (error.response) {
      // Request made and server responded
      message = error.response.data.message;
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      message = error.request._response;
    } else {
      // Something happened in setting up the request that triggered an Error
      message = error.message;
      // console.log('Error', error.message);
    }
    showMessage({
      message,
      type: 'danger',
    });
    return Promise.reject(error);
  },
);