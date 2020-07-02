import axios from 'axios';
import * as constants from '../constants';
import { fetchCategoryListAction } from './home-actions';

export function addCategoryItemRequest () {
    return {
        type: constants.ADD_CATEGORY_ITEM_REQUEST,
    }
}

export function addCategoryItemSuccess (item) {
    return {
        type: constants.ADD_CATEGORY_ITEM_SUCCESS,
        item,
    }
}

export function addCategoryItemFailure (error) {
    return {
        type: constants.ADD_CATEGORY_ITEM_FAILURE,
        error,
    }
}

export function resetState () {
    return {
        type: constants.RESET_CATEGORY_ITEM_STATE,
    }
}

export function addCategoryItemAction (catId, data) {
    return dispatch => {
        dispatch(addCategoryItemRequest())
        return axios.post(`/restaurant/menu-item/${catId}`, data)
            .then(response => {
                dispatch(fetchCategoryListAction());
                dispatch(addCategoryItemSuccess(response.data));
            })
            .catch(error => {
                dispatch(addCategoryItemFailure(error));
            });
    }
}

export function updateCategoryItemAction (data, catId, itemId) {
    return dispatch => {
        dispatch(addCategoryItemRequest())
        return axios.put(`/restaurant/menu-item/${catId}/${itemId}`, data)
            .then(response => {
                dispatch(fetchCategoryListAction());
                dispatch(addCategoryItemSuccess(response.data));
            })
            .catch(error => {
                dispatch(addCategoryItemFailure(error));
            });
    }
}

export function removeItemRequest () {
    return {
        type: constants.REMOVE_ITEM_REQUEST,
    }
}

export function removeItemSuccess (item) {
    return {
        type: constants.REMOVE_ITEM_SUCCESS,
        item,
    }
}

export function removeItemFailure (error) {
    return {
        type: constants.REMOVE_ITEM_FAILURE,
        error,
    }
}

export function removeItemAction (catId, id) {
    return dispatch => {
        dispatch(removeItemRequest())
        return axios.delete(`/restaurant/menu-item/${catId}/${id}`)
            .then(response => {
                dispatch(fetchCategoryListAction());
                dispatch(removeItemSuccess(response.data));
            })
            .catch(error => {
                dispatch(removeItemFailure(error));
            });
    }
}