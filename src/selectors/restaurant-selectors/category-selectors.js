import { createSelector } from 'reselect';
import { initialState } from '../../reducers/restaurant-reducers/category-reducer';

const selectCategoryState = state => state.get('restaurantCategory', initialState);

const makeSelectLoading = () => createSelector(
    selectCategoryState, state => state.getIn(['category', 'loading'])
);

const makeSelectCategory = () => createSelector(
    selectCategoryState, state => state.getIn(['category', 'data']).toJS()
);

const makeSelectError = () => createSelector(
    selectCategoryState, state => state.getIn(['category', 'error'])
);

export {
    makeSelectError,
    makeSelectLoading,
    makeSelectCategory,
    selectCategoryState,
};
