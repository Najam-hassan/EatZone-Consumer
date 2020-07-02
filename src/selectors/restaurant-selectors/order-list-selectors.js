import { createSelector } from 'reselect';
import { initialState } from '../../reducers/restaurant-reducers/order-list-reducer';

const selectOrderListState = state => state.get('restaurantOrderList', initialState);

const makeSelectOrderListLoading = () => createSelector(
    selectOrderListState, state => state.getIn(['orders', 'loading'])
);

const makeSelectDeliveryOrderList = () => createSelector(
    selectOrderListState, state => state.getIn(['orders', 'deliveries']).toJS()
);

const makeSelectCollectionOrderList = () => createSelector(
    selectOrderListState, state => state.getIn(['orders', 'collections']).toJS()
);

const makeSelectPaymentHistory = () => createSelector(
    selectOrderListState, state => state.getIn(['orders', 'payment']).toJS()
);

const makeSelectOrderListError = () => createSelector(
    selectOrderListState, state => state.getIn(['orders', 'error'])
);

const makeSelectConfirmed = () => createSelector(
    selectOrderListState, state => state.getIn(['orders', 'accepted'])
);

const makeSelectCompleted = () => createSelector(
    selectOrderListState, state => state.getIn(['orders', 'completed'])
);

const makeSelectCanceled = () => createSelector(
    selectOrderListState, state => state.getIn(['orders', 'canceled'])
);

const makeSelectOrderLoading = () => createSelector(
    selectOrderListState, state => state.getIn(['orders', 'updating'])
);

const makeSelectGetOrders = () => createSelector(
    selectOrderListState, state => state.get('orders').toJS()
);

export {
    makeSelectCanceled,
    makeSelectCompleted,
    makeSelectConfirmed,
    makeSelectGetOrders,
    selectOrderListState,
    makeSelectOrderLoading,
    makeSelectPaymentHistory,
    makeSelectOrderListError,
    makeSelectOrderListLoading,
    makeSelectDeliveryOrderList,
    makeSelectCollectionOrderList,
};
