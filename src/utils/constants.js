import { AsyncStorage } from 'react-native';
import axios from 'axios';

const getAuthToken = async () => {
  let token = null;
  await AsyncStorage.getItem("user").then((value) => {
    if (value) {
      token = JSON.parse(value).token;
      console.log("[constants.js] ,showing token",token)
      axios.defaults.headers.Authorization = `Bearer ${token}`;
    }
  });
}

// Network constants

//https://tranquil-anchorage-35603.herokuapp.com/api/v1
export const baseURL = 'https://foodallinone.com/api/v1';
// export const baseURL = 'https://1a7c5c1d.ngrok.io/api/v1';

const devTesting = false;
export const token = getAuthToken();