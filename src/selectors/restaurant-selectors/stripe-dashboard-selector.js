import { createSelector } from 'reselect';
import { initialState } from '../../reducers/restaurant-reducers/stripe-dashboard-reducer';

const selectResturantDashboardState = state => state.get('stripeDashboardReducer', initialState);

const makeSelectLoading = () => createSelector(
    selectResturantDashboardState, state => state.getIn(['dashboard', 'loading'])
);

const makeSelectDashboardURL = () => createSelector(
    selectResturantDashboardState, state => state.getIn(['dashboard', 'data'])
);

const makeSelectError = () => createSelector(
    selectResturantDashboardState, state => state.getIn(['dashboard', 'error'])
);

export {
    makeSelectError,
    makeSelectDashboardURL,
    makeSelectLoading,
};
