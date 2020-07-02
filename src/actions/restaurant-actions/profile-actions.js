import axios from 'axios';
import * as constants from '../constants';

export function updateProfileRequest() {
    return {
        type: constants.UPDATE_RESATURANT_PROFILE_REQUEST,
    }
}

export function updateProfileSuccess(profile, updating) {
    return {
        type: constants.UPDATE_RESATURANT_PROFILE_SUCCESS,
        profile,
        updating
    }
}

export function updateProfileFailure(error) {
    return {
        type: constants.UPDATE_RESATURANT_PROFILE_FAILURE,
        error,
    }
}

export function resetState() {
    return {
        type: constants.RESET_RESATURANT_PROFILE_STATE,
    }
}

export function updateProfileAction(data, updating) {
    return dispatch => {
        dispatch(updateProfileRequest());
        return axios.put(`/restaurant/edit-profile`, data)
            .then(response => {
                // console.log('updateProfileAction Response===========>>',response);
                dispatch(updateProfileSuccess(response.data, updating));
            })
            .catch(error => {
                dispatch(updateProfileFailure(error));
            });
    }
}

export function checkResturantExistRequest() {
    return {
        type: constants.CHECK_RESTAURANT_EXIST_REQUEST,
    }
}

export function checkResturantExistSuccess(data) {
    return {
        type: constants.CHECK_RESTAURANT_EXIST_SUCCESS,
        data
    }
}

export function checkResturantExistFailure(error) {
    return {
        type: constants.CHECK_RESTAURANT_EXIST_FAILURE,
        error,
    }
}

export function checkResturantExistAction(id) {
    return dispatch => {
        // dispatch(checkResturantExistRequest());
        return axios.get(`/restaurant/restaurant-exists/${id}`)
            .then(response => {
                console.log('restaurant exist==================>>>>>',response);
                dispatch(checkResturantExistSuccess(response.data));
            })
            .catch(error => {
                dispatch(checkResturantExistFailure(error))
            });
    }
}

