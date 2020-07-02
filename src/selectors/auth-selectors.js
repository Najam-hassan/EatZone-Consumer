import { createSelector } from 'reselect';
import { initialState } from '../reducers/auth-reducer';

const selectLoginState = state => state.get('auth', initialState);

const makeSelectLoading = () => createSelector(
    selectLoginState, state => state.getIn(['user', 'loading'])
);

const makeSelectForgotPasswordLoading = () => createSelector(
    selectLoginState, state => state.getIn(['forgotPassword', 'loading'])
);

const makeSelectForgotPasswordData = () => createSelector(
    selectLoginState, state => state.getIn(['forgotPassword', 'response'])
);

const makeSelectData = () => createSelector(
    selectLoginState, state => state.getIn(['user', 'data'])
);

const makeSelectSignInError = () => createSelector(
    selectLoginState, state => state.getIn(['user', 'error'])
);

const makeSelectError = () => createSelector(
    selectLoginState, state => state.getIn(['user', 'error'])
);

const makeSelectAuthStatue = () => createSelector(
    selectLoginState, state => state.getIn(['user', 'failed'])
);

const makeSelectSignUpUser = () => createSelector(
    selectLoginState, state => state.getIn(['signUp', 'data'])
);

const makeSelectSignUpError = () => createSelector(
    selectLoginState, state => state.getIn(['signUp', 'error'])
);

export {
    makeSelectData,
    makeSelectError,
    selectLoginState,
    makeSelectLoading,
    makeSelectSignUpUser,
    makeSelectAuthStatue,
    makeSelectSignInError,
    makeSelectSignUpError,
    makeSelectForgotPasswordData,
    makeSelectForgotPasswordLoading,
};
