import { fromJS, Map } from 'immutable';

import * as constants from '../../actions/constants';
import { guid } from '../../utils/misc';

export const initialState = fromJS({
    list: {
        data: {},
        error: null,
        loading: false,
        success: false,
    },
});

export default function placeOrderReducer (state = initialState, action) {
    switch (action.type) {
        case constants.PLACE_ORDER_REQUEST:
            return state.setIn(['list', 'loading'], true);

        case constants.PLACE_ORDER_SUCCESS: {
            const payload = Map({
                ...action.data,
                key: guid(),
            });
            return state
                .setIn(['list', 'data'], payload)
                .setIn(['list', 'loading'], false);
        }

        case constants.PLACE_ORDER_FAILURE:
            return state
                .setIn(['list', 'error'], action.error)
                .setIn(['list', 'loading'], false);

        case constants.RESET_PLACE_ORDER_STATE:
            return initialState;
        default:
            return state;
    }
}
