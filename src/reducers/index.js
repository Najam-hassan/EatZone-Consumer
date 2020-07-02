import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable'

import authReducer from './auth-reducer';

//User 
import homeReducer from './user-reducers/home-reducer';
import userOrderList from './user-reducers/order-list-reducer';
import userProfileReducer from './user-reducers/profile-reducer';
import placeOrderReducer from './user-reducers/place-order-reducer';
import restaurantsReducer from './user-reducers/restaurents-reducer';
import restaurantDetailReducer from './user-reducers/resturant-detail-reducer';

// Restaurant
import categoryList from './restaurant-reducers/home-reducer';
import profileReducer from './restaurant-reducers/profile-reducer';
import categoryReducer from './restaurant-reducers/category-reducer';
import restaurantOrderList from './restaurant-reducers/order-list-reducer';
import categoryItemReducer from './restaurant-reducers/category-item-reducer';
import stripeDashboardReducer from './restaurant-reducers/stripe-dashboard-reducer';
import paymentHistoryReducer from './restaurant-reducers/payment_history_reducer';

export default function index () {
    return combineReducers({
        form: formReducer,
        auth: authReducer,

        home: homeReducer,
        userOrderList: userOrderList,
        restaurants: restaurantsReducer,
        userProfile: userProfileReducer,
        placeOrderReducer: placeOrderReducer,
        restaurantDetail: restaurantDetailReducer,

        restaurantProfile: profileReducer,
        restaurantCategories: categoryList,
        restaurantCategory: categoryReducer,
        categoryItemReducer: categoryItemReducer,
        restaurantOrderList: restaurantOrderList,
        stripeDashboardReducer: stripeDashboardReducer,
        paymentHistoryReducer: paymentHistoryReducer,
    });
}
