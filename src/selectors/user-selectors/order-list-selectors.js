import { createSelector } from 'reselect';
import { initialState } from '../../reducers/user-reducers/order-list-reducer';

const selectOrderListState = state => state.get('userOrderList', initialState);

const makeSelectOrderListLoading = () => createSelector(
    selectOrderListState, state => state.getIn(['orders', 'loading'])
);

const makeSelectOrderList = () => createSelector(
    selectOrderListState, state => state.getIn(['orders', 'data']).toJS()
    // selectOrderListState, state => state.getIn(['orders', 'data'])

);

const makeSelectOrderListError = () => createSelector(
    selectOrderListState, state => state.getIn(['orders', 'error'])
);

export {
    makeSelectOrderList,
    selectOrderListState,
    makeSelectOrderListError,
    makeSelectOrderListLoading,
};
