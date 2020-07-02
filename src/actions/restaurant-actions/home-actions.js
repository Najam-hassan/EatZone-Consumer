import axios from 'axios';
import * as constants from '../constants';
import { categories } from '../../utils/test-data';

export function fetchCategoriesRequest () {
    return {
        type: constants.FETCH_CATEGORY_LIST_REQUEST,
    }
}

export function fetchCategoriesSuccess (data) {
    return {
        type: constants.FETCH_CATEGORY_LIST_SUCCESS,
        data: data.menu_categories,
        details: data
    }
}

export function fetchCategoriesFailure (error) {
    return {
        type: constants.FETCH_CATEGORY_LIST_FAILURE,
        error
    }
}

export function fetchCategoryListAction () {
    return dispatch => {
        dispatch(fetchCategoriesRequest());
        return axios.get('/restaurant/menu')
            .then(response => {
                dispatch(fetchCategoriesSuccess(response.data));
            })
            .catch(error => {
                dispatch(fetchCategoriesFailure());
            })
    }
}

export function deleteCategoryRequest () {
    return {
        type: constants.DELETE_CATEGORY_REQUEST,
    }
}

export function deleteCategorySuccess (id) {
    return {
        type: constants.DELETE_CATEGORY_SUCCESS,
        id,
    }
}

export function deleteCategoryFailure (error) {
    return {
        type: constants.DELETE_CATEGORY_FAILURE,
        error
    }
}

export function deleteCategoryAction (list) {
    return dispatch => {
        dispatch(deleteCategoryRequest());
        list.map(item => {
            return axios.delete(`/restaurant/menu-category/${item.id}`)
                .then(response => {
                    dispatch(deleteCategorySuccess(item.id));
                }).catch(error => {
                    dispatch(deleteCategoryFailure(error));
                })
        });
    }
}

export function showMoreOptions (id) {
    return {
        type: constants.TOGGLE_ACTION,
        id,
    }
}

export function selectAllAction (selectAll) {
    return {
        type: constants.SELECT_ALL_CATEGORY,
        selectAll,
    }
}

export function resetState () {
    return {
        type: constants.RESET_CATEGORY_LIST_STATE,
    }
}
