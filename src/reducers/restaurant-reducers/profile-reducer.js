import { fromJS, Map } from 'immutable';

import * as constants from '../../actions/constants';
import { guid } from '../../utils/misc';

export const initialState = fromJS({
    restaurant: {
        data: {},
        loading: false,
        error: null,
        updateSuccess: false,
    },
    existedRestaurant: {
        data: {}
    }
});

export default function profileReducer (state = initialState, action) {
    switch (action.type) {
        case constants.CHECK_RESTAURANT_EXIST_REQUEST:
            return state.setIn(['restaurant', 'loading'], true);

        case constants.CHECK_RESTAURANT_EXIST_SUCCESS: {
            const payload = Map(action.data);
            return state
                .setIn(['existedRestaurant', 'data'], payload)
                .setIn(['restaurant', 'loading'], false)
        }

        case constants.CHECK_RESTAURANT_EXIST_FAILURE:
            return state
                .setIn(['restaurant', 'error'], action.error)
                .setIn(['restaurant', 'loading'], false)

        case constants.UPDATE_RESATURANT_PROFILE_REQUEST:
            return state.setIn(['restaurant', 'loading'], true);

        case constants.UPDATE_RESATURANT_PROFILE_SUCCESS: {
            const payload = Map({
                ...action.profile,
                key: guid(),
            });
            return state
                .setIn(['restaurant', 'data'], payload)
                .setIn(['restaurant', 'loading'], false)
                .setIn(['restaurant', 'updateSuccess'], action.updating);
        }

        case constants.UPDATE_RESATURANT_PROFILE_FAILURE:
            return state.setIn(['restaurant', 'error'], action.error)
                .setIn(['restaurant', 'loading'], false);

        case constants.RESET_RESATURANT_PROFILE_STATE:
            return initialState;
        default:
            return state;
    }
}
