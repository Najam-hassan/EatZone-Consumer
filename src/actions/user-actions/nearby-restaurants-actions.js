import axios from 'axios';

import * as constants from '../constants';
import { resturants } from '../../utils/test-data'

export function fetchListRequest () {
    return {
        type: constants.FETCH_RESTAURENTS_REQUEST,
    }
}

export function fetchListSuccess (resturants) {
    return {
        type: constants.FETCH_RESTAURENTS_SUCCESS,
        data: resturants,
    }
}

export function fetchListFailure () {
    return {
        type: constants.FETCH_RESTAURENTS_FAILURE,
    }
}

export function fetchNearByListAction (id) {

    return dispatch => {
        dispatch(fetchListRequest());
        return axios.get(`/user/eligible-restaurants/${id}`)
            .then(response => {
                dispatch(fetchListSuccess(response.data));
            }).catch(error => {
                dispatch(fetchListFailure(error.response.data))
            });
    }
}