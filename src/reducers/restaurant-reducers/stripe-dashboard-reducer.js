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

export default function stripeDashboardReducer (state = initialState, action) {
    switch (action.type) {
        case constants.FETCH_DASHBORAD_URL_REQUEST:
            return state
                .setIn(['dashboard', 'loading'], true);

        case constants.FETCH_DASHBORAD_URL_SUCCESS: {
            return state
                .setIn(['dashboard', 'data'], action.data)
                .setIn(['dashboard', 'loading'], false);
        }

        case constants.FETCH_DASHBORAD_URL_FAILURE:
            return state
                .setIn(['dashboard', 'error'], action.error)
                .setIn(['dashboard', 'loading'], false);
                
        default:
            return state;
    }
}
