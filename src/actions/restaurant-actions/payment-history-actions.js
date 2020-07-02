import axios from 'axios';
import * as constants from '../constants';

export function fetchPaymentRequest () {
    return {
        type: constants.FETCH_PAYMENT_HISTORY_REQUEST,
    }
}

export function fetchPaymentSuccess (data) {
    return {
        type: constants.FETCH_PAYMENT_HISTORY_SUCCESS,
        data,
    }
}

export function fetchPaymentFailure (error) {
    return {
        type: constants.FETCH_PAYMENT_HISTORY_FAILURE,
        error
    }
}

export function fetchPaymentAction () {
    return dispatch => {
        dispatch(fetchPaymentRequest());
        return axios.get('/restaurant/payment-history')
            .then(response => {
                console.log('responsePayment===========>>>>>',response.data);
                dispatch(fetchPaymentSuccess(response.data));
            })
            .catch(error => {
                dispatch(fetchPaymentFailure(error));
            })
    }
}