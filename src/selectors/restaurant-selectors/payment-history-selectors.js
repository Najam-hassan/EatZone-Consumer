import { createSelector } from 'reselect';
import { initialState } from '../../reducers/restaurant-reducers/payment_history_reducer';

const selectOrderListState = state => state.get('paymentHistoryReducer', initialState);

const makeSelectLoading = () => createSelector(
    selectOrderListState, state => state.getIn(['payment', 'loading'])
);
const makeSelectPaymentHistory = () => createSelector(
    selectOrderListState, state => state.getIn(['payment', 'data'])
);

const makeSelectError = () => createSelector(
    selectOrderListState, state => state.getIn(['payment', 'error'])
);

export {
    makeSelectError,
    makeSelectLoading,
    makeSelectPaymentHistory,
};
