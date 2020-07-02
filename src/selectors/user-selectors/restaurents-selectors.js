import _ from 'lodash';
import { createSelector } from 'reselect';

import { getUnique } from '../../utils/misc';
import { initialState } from '../../reducers/user-reducers/restaurents-reducer';

const selectRestaurantsState = state => state.get('restaurants', initialState);

const makeSelectLoading = () => createSelector(
    selectRestaurantsState, state => state.getIn(['list', 'loading']));

// const makeSelectData = () => createSelector(
//     selectRestaurantsState, state => {
//         const restaurants = state.getIn(['list', 'data']).toJS();
//         return restaurants.filter(row => row.isValid === true);
//     }
// )

const makeSelectData = () => createSelector(
    selectRestaurantsState, state => {
        const restaurants = state.getIn(['list', 'data']).toJS();
        if (restaurants && restaurants.length > 0 &&
            restaurants[0].menu_categories && restaurants[0].menu_categories.length) {
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

const makeSelectError = () => createSelector(
    selectRestaurantsState, state => state.getIn(['list', 'error']));

export { selectRestaurantsState, makeSelectLoading, makeSelectData, makeSelectError };
