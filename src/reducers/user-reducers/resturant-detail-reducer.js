import { fromJS, Map, List } from 'immutable';

import * as constants from '../../actions/constants';
import { guid } from '../../utils/misc';

export const initialState = fromJS({
  list: {
    data: {},
    loading: false,
    error: null,
  },
  cart: {
    items: [],
  },
});

export default function detailReducer (state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_DETAIL_REQUEST:
      return state.setIn(['list', 'loading'], true);

    case constants.FETCH_DETAIL_SUCCESS: {
      action.data.menu_categories.forEach(category => {
        category.menu_items.forEach(item => {
          item['quantity'] = 0;
        });
      });
      const payload = Map({
        ...action.data,
        key: guid(),
      });
      return state
        .setIn(['list', 'data'], payload)
        .setIn(['list', 'loading'], false);
    }

    case constants.FETCH_DETAIL_FAILURE:
      return state
        .setIn(['list', 'error'], action.error)
        .setIn(['list', 'loading'], false);

    case constants.ADD_ITEM_QUANTITY:
      const payload = Map({
        ...state.getIn(['list', 'data']),
        menu_categories: action.data,
      });
      return state
        .setIn(['list', 'data'], payload)
        .setIn(['list', 'loading'], false);

    case constants.ADD_ITEM_TO_CART: {
      const payload = List(
        action.items.map(item =>
          Map({
            ...item,
          }),
        ),
      );
      return state.setIn(['cart', 'items'], payload)
    }

    case constants.RESET_DETAIL_STATE:
      return initialState;
    default:
      return state;
  }
}
