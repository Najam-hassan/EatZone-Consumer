import { fromJS, List, Map } from 'immutable';

import * as constants from '../../actions/constants';
import { guid } from '../../utils/misc';

export const initialState = fromJS({
    category: {
        data: {},
        loading: false,
        error: null,
    },
});

export default function categoryReducer (state = initialState, action) {
    switch (action.type) {
        case constants.ADD_CATEGORY_REQUEST:
            return state
                .setIn(['category', 'loading'], true);

        case constants.ADD_CATEGORY_SUCCESS: {
            const payload = Map({
                ...action.category,
                key: guid(),
            });
            return state
                .setIn(['category', 'data'], payload)
                .setIn(['category', 'loading'], false);
        }

        case constants.ADD_CATEGORY_FAILURE:
            return state
                .setIn(['category', 'error'], action.error)
                .setIn(['category', 'loading'], false);

        case constants.RESET_CATEGORY_STATE:
            return initialState;
        default:
            return state;
    }
}
