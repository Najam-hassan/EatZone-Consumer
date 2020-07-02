import { fromJS, Map } from 'immutable';

import * as constants from '../../actions/constants';
import { guid } from '../../utils/misc';

export const initialState = fromJS({
    categoryItem: {
        data: {},
        loading: false,
        error: null,
    },
    deleteCatItem: {
        success: false,
        loading: false,
        failed: false
    }
});

export default function categoryItemReducer (state = initialState, action) {
    switch (action.type) {
        case constants.ADD_CATEGORY_ITEM_REQUEST:
            return state
                .setIn(['categoryItem', 'loading'], true);

        case constants.ADD_CATEGORY_ITEM_SUCCESS: {
            const payload = Map({
                ...action.item,
                key: guid(),
            });
            return state
                .setIn(['categoryItem', 'data'], payload)
                .setIn(['categoryItem', 'loading'], false);
        }

        case constants.ADD_CATEGORY_ITEM_FAILURE:
            return state
                .setIn(['categoryItem', 'error'], action.error)
                .setIn(['categoryItem', 'loading'], false);

        case constants.REMOVE_ITEM_REQUEST:
            return state.setIn(['deleteCatItem', 'loading'], true);

        case constants.REMOVE_ITEM_SUCCESS:
            return state
                .setIn(['deleteCatItem', 'loading'], false)
                .setIn(['deleteCatItem', 'success'], true);

        case constants.REMOVE_ITEM_FAILURE:
            return state
                .setIn(['deleteCatItem', 'loading'], false)
                .setIn(['deleteCatItem', 'failed'], true);

        case constants.RESET_CATEGORY_ITEM_STATE:
            return initialState;
        default:
            return state;
    }
}
