import axios from 'axios';
import * as constants from '../constants';

function fetchOrderRrquest () {
    return {
        type: constants.FETCH_USER_ORDERS_REQUEST,
    }
}

function fetchOrderSuccess (data) {
    return {
        type: constants.FETCH_USER_ORDERS_SUCCESS,
        data,
    }
}
export function resetOrder () {
    return {
        type: constants.RESET_ORDERS_STATE,    }
}
function fetchOrderFailure (error) {
    return {
        type: constants.FETCH_USER_ORDERS_FAILURE,
        error,
    }
}

export function fetchOrdersAction (offset) {
    console.log('showing offset in here ',offset)
    return dispatch => {
        dispatch(fetchOrderRrquest());
        return axios.get(`/user/get-orders?offset=${offset}&limit=10`)
            .then(response => {
                if(response.data.rows.length > 0) {
                    dispatch(fetchOrderSuccess(response.data.rows));
                }
                console.log("showing response fetched",response)
                // dispatch(fetchOrderFailure('Full'))

            })
            .catch(error => {
                dispatch(fetchOrderFailure(error))
            })
    }
}