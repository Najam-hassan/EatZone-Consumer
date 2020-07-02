/* eslint-disable no-unused-vars */
import axios from 'axios';
import { baseURL, token } from './constants';

axios.defaults.baseURL = baseURL;
export const axiosClient = axios.create({
    baseURL,
    headers: {
        Authorization: `Bearer ${token}`
    },
});

export default axiosClient;