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

export default function paymentHistoryReducer (state = initialState, action) {
    switch (action.type) {
        case constants.FETCH_PAYMENT_HISTORY_REQUEST:
            return state
                .setIn(['payment', 'loading'], true);

        case constants.FETCH_PAYMENT_HISTORY_SUCCESS: {
            return state
                .setIn(['payment', 'data'], action.data)
                .setIn(['payment', 'loading'], false);
        }

        case constants.FETCH_PAYMENT_HISTORY_FAILURE:
            return state
                .setIn(['payment', 'error'], action.error)
                .setIn(['payment', 'loading'], false);
                
        default:
            return state;
    }
}
