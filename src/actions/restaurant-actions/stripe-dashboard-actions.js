import axios from 'axios';
import * as constants from '../constants';

export function fetchDashboadRequest () {
    return {
        type: constants.FETCH_DASHBORAD_URL_REQUEST,
    }
}

export function fetchDashboadSuccess (data) {
    return {
        type: constants.FETCH_DASHBORAD_URL_SUCCESS,
        data,
    }
}

export function fetchDashboadFailure (error) {
    return {
        type: constants.FETCH_DASHBORAD_URL_FAILURE,
        error
    }
}

export function fetchDashboardURLAction () {
    return dispatch => {
        dispatch(fetchDashboadRequest());
        return axios.get('/restaurant/stripe-dashboard')
            .then(response => {
                console.log('response===========>>>>>',response.data);
                dispatch(fetchDashboadSuccess(response.data));
            })
            .catch(error => {
                dispatch(fetchDashboadFailure(error));
            })
    }
}