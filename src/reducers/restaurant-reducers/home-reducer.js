import { fromJS, List, Map } from 'immutable';

import * as constants from '../../actions/constants';
import { guid } from '../../utils/misc';

export const initialState = fromJS({
    categories: {
        data: [],
        error: null,
        details: {},
        loading: false,
        isDeleted: false,
    },
});

export default function homeReducer (state = initialState, action) {
    switch (action.type) {
        case constants.FETCH_CATEGORY_LIST_REQUEST:
            return state
                .setIn(['categories', 'loading'], true);

        case constants.FETCH_CATEGORY_LIST_SUCCESS: {
            const payload = List(
                action.data.map(item =>
                    Map({
                        ...item,
                        key: guid(),
                        selected: false,
                        showCheckBox: false,
                    }),
                ),
            );
            return state
                .setIn(['categories', 'data'], payload)
                .setIn(['categories', 'details'], Map(action.details))
                .setIn(['categories', 'loading'], false);
        }

        case constants.DELETE_CATEGORY_REQUEST:
            return state.setIn(['categories', 'loading'], true);

        case constants.DELETE_CATEGORY_SUCCESS: {
            const index = state.getIn(['categories', 'data']).findIndex(row => (
                row.get('id') === action.id
            ));
            return state
                .deleteIn(['categories', 'data', index])
                .setIn(['categories', 'loading'], false)
                .setIn(['categories', 'isDeleted'], true);
        }

        case constants.DELETE_CATEGORY_FAILURE:
            return state
                .setIn(['categories', 'error'], action.error)
                .setIn(['categories', 'loading'], false);

        case constants.ADD_CATEGORY_LOCALLY: {
            const payload = Map({
                ...action.category,
                key: guid()
            });

            return state.updateIn(['categories', 'data'], data => data.push(payload));
        }

        case constants.TOGGLE_ACTION: {
            const index = state
                .getIn(['categories', 'data'])
                .findIndex(row => row.get('id') === action.id);
            return state.updateIn(['categories', 'data', index], list => (
                list.set('selected', !list.get('selected'))
            ));
        }

        case constants.SELECT_ALL_CATEGORY: {
            const payload = state.getIn(['categories', 'data']).map(item => (
                item.set('selected', action.selectAll)
            ));
            return state.setIn(['categories', 'data'], payload)
        }

        case constants.RESET_CATEGORY_LIST_STATE:
            return initialState;
        default:
            return state;
    }
}
