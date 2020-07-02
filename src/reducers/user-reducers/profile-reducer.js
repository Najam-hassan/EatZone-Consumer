import { fromJS, Map } from 'immutable';

import * as constants from '../../actions/constants';
import { guid } from '../../utils/misc';

export const initialState = fromJS({
    profile: {
        data: {},
        error: null,
        loading: false,
        success: false,
        updating: false,
    },
});

export default function profileReducer(state = initialState, action) {
    switch (action.type) {
        case constants.PROFILE_DATEILS_REQUEST:
            return state
                .setIn(['profile', 'updating'], false)
                .setIn(['profile', 'loading'], true);

        case constants.PROFILE_DATEILS_SUCCESS: {
            const payload = Map({
                ...action.data,
                key: guid(),
            });
            return state
                .setIn(['profile', 'data'], payload)
                .setIn(['profile', 'updating'], action.updating)
                .setIn(['profile', 'success'], true)
                .setIn(['profile', 'loading'], false);
        }

        case constants.PROFILE_DATEILS_FAILURE:
            return state
                .setIn(['profile', 'error'], action.error)
                .setIn(['profile', 'loading'], false);

        case constants.RESET_USER_PROFILE:
            return initialState;
        default:
            return state;
    }
}
