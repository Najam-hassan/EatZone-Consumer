import { createSelector } from 'reselect';
import { initialState } from '../../reducers/user-reducers/resturant-detail-reducer';

const selectRestaurantDetailState = state => state.get('restaurantDetail', initialState);

const makeSelectRestaurantLoading = () => createSelector(
  selectRestaurantDetailState, state => state.getIn(['list', 'loading'])
);

const makeSelectRestaurantDetail = () => createSelector(
  selectRestaurantDetailState, state => state.getIn(['list', 'data']).toJS()
);

const makeSelectRestaurantError = () => createSelector(
  selectRestaurantDetailState, state => state.getIn(['list', 'error'])
);

const makeSelectCartItem = () => createSelector(
  selectRestaurantDetailState, state => state.getIn(['cart', 'items']).toJS()
);

export {
  makeSelectCartItem,
  makeSelectRestaurantError,
  makeSelectRestaurantDetail,
  selectRestaurantDetailState,
  makeSelectRestaurantLoading,
};
