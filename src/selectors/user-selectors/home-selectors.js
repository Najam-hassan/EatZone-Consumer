import _ from 'lodash';
import { createSelector } from 'reselect';

import { getUnique } from '../../utils/misc';
import { initialState } from '../../reducers/user-reducers/home-reducer';

const selectHomeState = state => state.get('home', initialState);

const makeSelectLoading = () => createSelector(
  selectHomeState, state => state.getIn(['list', 'loading'])
);

const makeSelectData = () => createSelector(
  selectHomeState, state => state.getIn(['list', 'data']).toJS()
);

const makeSelectFilterData = () => createSelector(
  selectHomeState, state => {
    const restaurants = state.getIn(['list', 'data']).toJS();
    if (restaurants && restaurants.length > 0) {
      const list = _.flatMap(restaurants, category => {
        if (category.menu_categories && category.menu_categories.length) {
          return _(category.menu_categories).map(menuItems => (
            menuItems.menu_items.length > 0 && ({
              ...category
            })
          )).value()
        }
      });
      const data = list.filter(row => row);
      return getUnique(data, 'id');
    } else {
      return restaurants;
    }
  }
)
const makeSelectCollectingList = () => createSelector(
  selectHomeState, state => {
    const restaurants = state.getIn(['collecting', 'data']).toJS();
    return restaurants;
  }
)

const makeSelectError = () => createSelector(
  selectHomeState, state => state.getIn(['list', 'error'])
);

const makeSelectCollectingResturant = () => createSelector(
  selectHomeState, state => state.getIn(['restaurant', 'collectingResturant']).toJS()
);

const makeSelectdeliveryResturant = () => createSelector(
  selectHomeState, state => state.getIn(['restaurant', 'deliveryResturant']).toJS()
);

export {
  makeSelectData,
  selectHomeState,
  makeSelectError,
  makeSelectLoading,
  makeSelectFilterData,
  makeSelectCollectingList,
  makeSelectdeliveryResturant,
  makeSelectCollectingResturant,
};
