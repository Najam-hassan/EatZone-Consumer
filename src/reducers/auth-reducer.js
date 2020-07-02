import { fromJS } from 'immutable';

import * as constants from '../actions/constants';
import { guid } from '../utils/misc';

export const initialState = fromJS({
    user: {
        data: null,
        loading: false,
        error: null,
        failed: false,
    },
    signUp: {
        data: null,
        error: null,
        failed: false
    },
    forgotPassword: {
        loading: false,
        success: false,
        response: {},
        error: ''
    }
});

export default function authReducer (state = initialState, action) {
    switch (action.type) {
        case constants.USER_LOGIN_REQUEST:
            return state
                .setIn(['user', 'data'], null)
                .setIn(['user', 'loading'], true);

        case constants.USER_LOGIN_SUCCESS: {
            return state
                .setIn(['user', 'error'], null)
                .setIn(['user', 'data'], action.user)
                .setIn(['user', 'loading'], false);
        }

        case constants.USER_LOGIN_FAILURE:
            return state
                .setIn(['user', 'error'], action.error)
                .setIn(['user', 'failed'], true)
                .setIn(['user', 'loading'], false);

        case constants.USER_SIGNUP_REQUEST:
            return state
                .setIn(['signUp', 'data'], null)
                .setIn(['user', 'loading'], true);

        case constants.USER_SIGNUP_SUCCESS: {
            return state
                .setIn(['user', 'error'], null)
                .setIn(['signUp', 'data'], action.user)
                .setIn(['user', 'loading'], false);
        }

        case constants.USER_SIGNUP_FAILURE:
            return state
                .setIn(['signUp', 'error'], action.error)
                .setIn(['user', 'failed'], true)
                .setIn(['user', 'loading'], false);

        case constants.FORGOT_PASSWORD_REQUEST:
            return state
                .setIn(['forgotPassword', 'loading'], true);

        case constants.FORGOT_PASSWORD_SUCCESS: {
            const payload = {
                ...action.data,
                key: guid()
            };
            return state
                .setIn(['forgotPassword', 'success'], true)
                .setIn(['forgotPassword', 'response'], payload)
                .setIn(['forgotPassword', 'loading'], false);
        }

        case constants.FORGOT_PASSWORD_FAILURE:
            return state
                .setIn(['forgotPassword', 'error'], action.error)
                .setIn(['forgotPassword', 'loading'], false);

        case constants.RESET_LOGIN_STATE:
            return initialState;
        default:
            return state;
    }
}
