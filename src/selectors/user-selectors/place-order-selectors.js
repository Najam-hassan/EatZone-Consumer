import { createSelector } from 'reselect';
import { initialState } from '../../reducers/user-reducers/place-order-reducer';

const selectPlaceOrderState = state => state.get('placeOrderReducer', initialState);

const makeSelectPlaceOrderLoading = () => createSelector(
    selectPlaceOrderState, state => state.getIn(['list', 'loading'])
);

const makeSelectPlaceOrderData = () => createSelector(
    selectPlaceOrderState, state => state.getIn(['list', 'data']).toJS()
);

const makeSelectPlaceOrderError = () => createSelector(
    selectPlaceOrderState, state => state.getIn(['list', 'error'])
);

const makeSelectUpdateStatue = () => createSelector(
    selectPlaceOrderState, state => state.getIn(['list', 'success'])
);

export {
    selectPlaceOrderState,
    makeSelectUpdateStatue,
    makeSelectPlaceOrderData,
    makeSelectPlaceOrderError,
    makeSelectPlaceOrderLoading,
};
