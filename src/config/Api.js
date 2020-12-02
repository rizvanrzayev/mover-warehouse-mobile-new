import axios from 'axios';
import {showMessage} from 'react-native-flash-message';
import {getToken} from 'helpers/AsyncStorage';
import Config from 'react-native-config';

const {BASE_URL} = Config;

export const ApiClient = axios.create({
  baseURL: BASE_URL,
  validateStatus: (status) => status > 199 && status < 300,
  timeout: 10000,
});

export const API_ROUTES = {
  login: 'worker/login',
  queueList: 'worker/queue-list',
  startQueue: 'worker/start-queue',
  queue: 'worker/queue',
  activeQueue: 'worker/active-queue',
  give: 'worker/give',
  took: 'worker/took',
  customerGone: 'worker/customer-gone',
  settings: 'worker/settings',
  approveReceivePacket: 'worker/approve-receive-packet',
  me: 'worker/me',
  sendings: 'sorting/sendings',
  warehouseSendings: 'sorting/warehouse/sendings',
  warehouseSackOrders: 'sorting/warehouse/sack/orders',
  sackJoin: 'sorting/sack/join',
  addOrderToSack: 'sorting/sack/order/add',
  selectShelf: 'worker/select-shelf',
  addToShelf: 'worker/add-to-shelf',
};

const notAuthRequiredUrls = ['worker/login'];

ApiClient.interceptors.request.use(async (config) => {
  if (!notAuthRequiredUrls.includes(config.url)) {
    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export const configureResponseInterceptors = (onUnauth) => {
  ApiClient.interceptors.response.use(
    function (response) {
      // Do something with response data
      return response;
    },
    function (error) {
      if (error?.response?.status === 401) {
        onUnauth();
      }
      let message = '';
      if (error?.response) {
        if (error?.response?.data?.message) {
          message = error?.response?.data?.message;
        } else {
          message = 'Bilinməyən xəta!';
        }
      } else if (error?.request) {
        message = 'Zəhmət olmasa internet əlaqəsini yoxlayın';
      } else {
        message = 'Network error';
      }
      showMessage({
        message,
        position: 'top',
        type: 'danger',
      });
      showMessage({
        message,
        type: 'danger',
      });
      return Promise.reject(error);
    },
  );
};
