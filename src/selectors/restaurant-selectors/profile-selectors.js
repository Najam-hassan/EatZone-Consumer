import { createSelector } from 'reselect';
import { initialState } from '../../reducers/restaurant-reducers/profile-reducer';

const selectRestaurantProfileState = state => state.get('restaurantProfile', initialState);

const makeSelectProfileLoading = () => createSelector(
    selectRestaurantProfileState, state => state.getIn(['restaurant', 'loading'])
);

const makeSelectorProfileStatus = () => createSelector(
    selectRestaurantProfileState, state => state.getIn(['restaurant', 'updateSuccess'])
);

const makeSelectProflieData = () => createSelector(
    selectRestaurantProfileState, state => state.getIn(['restaurant', 'data']).toJS()
);

const makeSelectError = () => createSelector(
    selectRestaurantProfileState, state => state.getIn(['restaurant', 'error'])
);

const makeSelectIsExisted = () => createSelector(
    selectRestaurantProfileState, state => state.getIn(['existedRestaurant', 'data']).toJS()
);

export {
    makeSelectError,
    makeSelectIsExisted,
    makeSelectProflieData,
    makeSelectProfileLoading,
    makeSelectorProfileStatus,
    selectRestaurantProfileState,
};
