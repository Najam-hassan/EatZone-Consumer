import { fromJS, Map, List } from 'immutable';

import * as constants from '../../actions/constants';
import { guid } from '../../utils/misc';

export const initialState = fromJS({
    orders: {
        deliveries: [],
        collections: [],
        completed: false,
        canceled: false,
        accepted: false,
        updating: false,
        loading: false,
        error: null,
    },
});

export default function orderListReducer (state = initialState, action) {
    switch (action.type) {
        case constants.FETCH_RESTAURANT_ORDERS_REQUEST:
            return state.setIn(['orders', 'loading'], true);

        case constants.FETCH_RESTAURANT_ORDERS_SUCCESS: {
            const collections = List(
                action.data && action.data.collections.map(item =>
                    Map({
                        ...item,
                        key: guid(),
                    }),
                ),
            );
            const deliveries = List(
                action.data && action.data.deliveries.map(item =>
                    Map({
                        ...item,
                        key: guid(),
                    }),
                ),
            );
            return state
                .setIn(['orders', 'deliveries'], deliveries)
                .setIn(['orders', 'collections'], collections)
                .setIn(['orders', 'loading'], false);
        }

        case constants.FETCH_RESTAURANT_ORDERS_FAILURE:
            return state
                .setIn(['orders', 'error'], action.error)
                .setIn(['orders', 'loading'], false);

        case constants.UPDATE_RESTAURANT_ORDERS_REQUEST:
            return state.setIn(['orders', 'updating'], true);

        case constants.UPDATE_STATUS_LOCALLY:
            return state
                .setIn(['orders', action.orderStatus], true)
                .setIn(['orders', 'updating'], false);

        case constants.UPDATE_RESTAURANT_ORDERS_REQUEST:
            return state
                .setIn(['orders', 'updating'], true)
                .setIn(['orders', action.orderStatus], true);

        case constants.RESET_RESTAURANT_ORDERS_STATE:
            return initialState;
        default:
            return state;
    }
}
