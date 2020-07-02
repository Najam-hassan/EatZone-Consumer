import axios from 'axios';
import * as constants from '../constants';

function placeOrderRrquest () {
    return {
        type: constants.PLACE_ORDER_REQUEST,
    }
}

function placeOrderSuccess (data) {
    return {
        type: constants.PLACE_ORDER_SUCCESS,
        data
    }
}

function placeOrderFailure (data) {
    return {
        type: constants.PLACE_ORDER_FAILURE,
        data,
    }
}

export function resetOrderState () {
    return {
        type: constants.RESET_PLACE_ORDER_STATE,
    }
}

export function placeOrderAction (data) {
    console.log("showing orders in data",data)
    return dispatch => {
        dispatch(placeOrderRrquest());
        return axios.post(`/user/place-order`, data)
            .then(response => {
                console.log('orderResponse ===>>>',response);
                dispatch(placeOrderSuccess(response.data));
            })
            .catch(error => {
                console.log('orderResponse ===>>>',response);
                dispatch(placeOrderFailure(error))
            })
    }
}