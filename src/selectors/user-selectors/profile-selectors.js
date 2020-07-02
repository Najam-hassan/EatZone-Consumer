import { createSelector } from 'reselect';
import { initialState } from '../../reducers/user-reducers/profile-reducer';

const selectProfileState = state => state.get('userProfile', initialState);

const makeSelectProfileLoading = () => createSelector(
    selectProfileState, state => state.getIn(['profile', 'loading'])
);

const makeSelectProfileUpdating = () => createSelector(
    selectProfileState, state => state.getIn(['profile', 'updating'])
);

const makeSelectProfileData = () => createSelector(
    selectProfileState, state => state.getIn(['profile', 'data']).toJS()
);

const makeSelectProfileError = () => createSelector(
    selectProfileState, state => state.getIn(['profile', 'error'])
);

const makeSelectUpdateStatue = () => createSelector(
    selectProfileState, state => state.getIn(['profile', 'success'])
);

export {
    selectProfileState,
    makeSelectProfileData,
    makeSelectUpdateStatue,
    makeSelectProfileError,
    makeSelectProfileLoading,
    makeSelectProfileUpdating,
};
