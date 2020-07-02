import axios from 'axios';
import * as constants from '../constants';

function fetchOrderRrquest() {
    return {
        type: constants.FETCH_RESTAURANT_ORDERS_REQUEST,
    }
}

function fetchOrderSuccess(data) {
    return {
        type: constants.FETCH_RESTAURANT_ORDERS_SUCCESS,
        data,
    }
}

function fetchOrderFailure(error) {
    return {
        type: constants.FETCH_RESTAURANT_ORDERS_FAILURE,
        error,
    }
}

export function resetOrderState() {
    return {
        type: constants.RESET_RESTAURANT_ORDERS_STATE,
    }
}

export function fetchOrdersAction() {
    return dispatch => {
        dispatch(fetchOrderRrquest());
        return axios.get(`/restaurant/get-orders`)
            .then(response => {
                // console.log('Recent Orders=====>>',response.data);
                dispatch(fetchOrderSuccess(response.data));
            })
            .catch(error => {
                dispatch(fetchOrderFailure(error))
            })
    }
}

function updateOrderRequest() {
    return {
        type: constants.UPDATE_RESTAURANT_ORDERS_REQUEST,
    }
}

function updateOrderSuccess(data) {
    return {
        type: constants.UPDATE_RESTAURANT_ORDERS_SUCCESS,
        data,
    }
}

function updateOrderFailure(error) {
    return {
        type: constants.UPDATE_RESTAURANT_ORDERS_FAILURE,
        error,
    }
}

export function updateLocally(orderStatus) {
    return {
        type: constants.UPDATE_STATUS_LOCALLY,
        orderStatus,
    }
}

export function updateOrderStatusAction(url, orderStatus) {
    return dispatch => {
        dispatch(updateOrderRequest());
        axios.put(url)
            .then(response => {
                console.log('response====>>>',response);
                // dispatch(updateOrderSuccess(response.data));
                dispatch(updateLocally(orderStatus))
            })
            .catch(error => {
                dispatch(updateOrderFailure(error));
            })
    }
}