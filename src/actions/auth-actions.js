import axios from 'axios';
import * as constants from './constants';
import { AsyncStorage } from 'react-native';

export function loginRequest () {
    return {
        type: constants.USER_LOGIN_REQUEST,
    }
}

export function loginSuccess (user) {
    return {
        type: constants.USER_LOGIN_SUCCESS,
        user,
    }
}

export function loginFailure (error) {
    return {
        type: constants.USER_LOGIN_FAILURE,
        error,
    }
}

export function registerRequest () {
    return {
        type: constants.USER_SIGNUP_REQUEST,
    }
}

export function registerSuccess (user) {
    return {
        type: constants.USER_SIGNUP_SUCCESS,
        user,
    }
}

export function registerFailure (error) {
    return {
        type: constants.USER_SIGNUP_FAILURE,
        error,
    }
}

export function resetAuthState () {
    return {
        type: constants.RESET_LOGIN_STATE,
    }
}

export function loginAction (url, user) {
    console.log('showing passed user',user)
    return dispatch => {
        dispatch(loginRequest())
        return axios.post(url, user)
            .then(async(response) => {
                console.log('loginRes===>>>',response);

                axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;
                await AsyncStorage.setItem('userRes', JSON.stringify(response.data)) || null ;
                console.log('loginRes===>>>',response.data);
                dispatch(loginSuccess(response.data));
            })
            .catch(error => {
                console.log('showing errors',error)
                dispatch(loginFailure(error.response ? error.response.data : null));
            });
    }
}

export function registerAction (url, user) {
    console.log('param',url,user);
    
    return dispatch => {
        dispatch(registerRequest())
        return axios.post(url, user)
            .then(response => {
                dispatch(registerSuccess(response.data));
            })
            .catch(error => {
                console.log('error====>>>>',error);
                dispatch(registerFailure(error.response ? error.response.data : null));
            });
    }
}

export function forgotPasswordRequest () {
    return {
        type: constants.FORGOT_PASSWORD_REQUEST,
    }
}

export function forgotPasswordSuccess (data) {
    return {
        type: constants.FORGOT_PASSWORD_SUCCESS,
        data,
    }
}

export function forgotPasswordFailure (error) {
    return {
        type: constants.FORGOT_PASSWORD_FAILURE,
        error,
    }
}

export function forgotPasswordAction (url, values) {
    return dispatch => {
        dispatch(forgotPasswordRequest())
        return axios.post(url, values)
            .then(response => {
                dispatch(forgotPasswordSuccess(response.data));
            })
            .catch(error => {
                dispatch(forgotPasswordFailure(error.response ? error.response.data : null));
            });
    }

}