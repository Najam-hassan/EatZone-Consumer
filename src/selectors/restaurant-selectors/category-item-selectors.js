import { createSelector } from 'reselect';
import { initialState } from '../../reducers/restaurant-reducers/category-item-reducer';
import { initialState as listInitialState } from '../../reducers/restaurant-reducers/home-reducer';

const selectCategoryItemState = state => state.get('categoryItemReducer', initialState);
const selectCategoryListState = state => state.get('restaurantCategories', listInitialState);

const makeSelectLoading = () => createSelector(
    selectCategoryItemState, state => state.getIn(['categoryItem', 'loading'])
);

const makeSelectListLoading = () => createSelector(
    selectCategoryListState, state => state.getIn(['categories', 'loading'])
);

const makeSelectCategoryItem = () => createSelector(
    selectCategoryItemState, state => state.getIn(['categoryItem', 'data']).toJS()
);

const makeSelectError = () => createSelector(
    selectCategoryItemState, state => state.getIn(['categoryItem', 'error'])
);

const makeSelectDeleteLoading = () => createSelector(
    selectCategoryItemState, state => state.getIn(['deleteCatItem', 'loading'])
);

const makeSelectDeleteFailed = () => createSelector(
    selectCategoryItemState, state => state.getIn(['deleteCatItem', 'failed'])
);

const makeSelectSuccessStatus = () => createSelector(
    selectCategoryItemState, state => state.getIn(['deleteCatItem', 'success'])
);

export {
    makeSelectError,
    makeSelectLoading,
    makeSelectListLoading,
    makeSelectDeleteFailed,
    makeSelectCategoryItem,
    selectCategoryItemState,
    makeSelectDeleteLoading,
    makeSelectSuccessStatus,
};
