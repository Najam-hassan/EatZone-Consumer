import { createSelector } from 'reselect';
import { initialState } from '../../reducers/restaurant-reducers/home-reducer';

const selectResturantHomeState = state => state.get('restaurantCategories', initialState);

const makeSelectLoading = () => createSelector(
    selectResturantHomeState, state => state.getIn(['categories', 'loading'])
);

const makeSelectCategoryList = () => createSelector(
    selectResturantHomeState, state => state.getIn(['categories', 'data']).toJS()
);

const makeSelectProfileDetails = () => createSelector(
    selectResturantHomeState, state => state.getIn(['categories', 'details']).toJS()
);

const makeSelectSelectedList = () => createSelector(
    selectResturantHomeState, state => (
        state.getIn(['categories', 'data']).filter(row => (
            row.get('selected') === true
        ))
    ).toJS()
);

const makeSelectError = () => createSelector(
    selectResturantHomeState, state => state.getIn(['categories', 'error'])
);

const makeSelectIsDeleted = () => createSelector(
    selectResturantHomeState, state => state.getIn(['categories', 'isDeleted'])
);

export {
    makeSelectError,
    makeSelectLoading,
    makeSelectIsDeleted,
    makeSelectCategoryList,
    makeSelectSelectedList,
    selectResturantHomeState,
    makeSelectProfileDetails,
};
