import { fromJS, List, Map } from 'immutable';
import moment from 'moment';

import { guid } from '../../utils/misc';
import * as constants from '../../actions/constants';

export const initialState = fromJS({
  list: {
    data: [],
    loading: false,
    error: null,
  },
  collecting: {
    data: [],
  },
  restaurant: { collectingResturant: {}, deliveryResturant: {} }
});

export default function homeReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_COLLECTING_LIST_REQUEST:
      return state.setIn(['list', 'loading'], true);

    case constants.FETCH_COLLECTING_LIST_SUCCESS: {
      const payload = List(
        action.data.map(item => {
          const date = new Date();
          const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds}`;
          const isValid = (moment(item.collectTimeEnd, "h:mm:ss").diff(moment(item.collectTimeStart, "h:mm:ss")) > 0) && (moment(time, "h:mm:ss").diff(moment(item.collectTimeEnd, "h:mm:ss")) < 0) ? ((moment(time, "h:mm:ss").format("HH:mm:ss") < item.collectTimeEnd &&
            moment(time, "h:mm:ss").format("HH:mm:ss") >= item.collectTimeStart)) : (moment(time, "h:mm:ss").format("HH:mm:ss") > item.collectTimeStart) && (moment(item.collectTimeEnd, "h:mm:ss").diff(moment(item.collectTimeStart, "h:mm:ss")) > 0 ? (moment(time, "h:mm:ss").format("HH:mm:ss") < item.collectTimeEnd) : true);
          return (
            Map({
              ...item,
              key: guid(),
              isValid: isValid,
            })
          )
        }),
      );
      return state
        .setIn(['collecting', 'data'], payload)
        .setIn(['list', 'data'], List())
        .setIn(['list', 'loading'], false);
    }

    case constants.FETCH_COLLECTING_LIST_FAILURE:
      return state
        .setIn(['list', 'error'], action.error)
        .setIn(['list', 'loading'], false);


    case constants.FETCH_LIST_REQUEST:
      return state.setIn(['list', 'loading'], true);

    case constants.FETCH_LIST_SUCCESS: {
      const payload = List(
        action.data.map(item => {
          const date = new Date();
          const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds}`;
          const isValid = (moment(item.deliverTimeEnd, "h:mm:ss").diff(moment(item.deliverTimeStart, "h:mm:ss")) > 0) && (moment(time, "h:mm:ss").diff(moment(item.deliverTimeEnd, "h:mm:ss")) < 0) ? ((moment(time, "h:mm:ss").format("HH:mm:ss") < item.deliverTimeEnd &&
            moment(time, "h:mm:ss").format("HH:mm:ss") >= item.deliverTimeStart)) : (moment(time, "h:mm:ss").format("HH:mm:ss") > item.deliverTimeStart) && (moment(item.deliverTimeEnd, "h:mm:ss").diff(moment(item.deliverTimeStart, "h:mm:ss")) > 0 ? (moment(time, "h:mm:ss").format("HH:mm:ss") < item.deliverTimeEnd) : true);
          return (
            Map({
              ...item,
              isValid: isValid,
              key: guid(),
            })
          )
        }),
      );
      return state
        .setIn(['list', 'data'], payload)
        .setIn(['collecting', 'data'], List())
        .setIn(['list', 'loading'], false);
    }

    case constants.FETCH_LIST_FAILURE:
      return state
        .setIn(['list', 'error'], action.error)
        .setIn(['list', 'loading'], false);

    case constants.SET_COLLECTING_RESTAURANT:
      return state
        .setIn(['restaurant', 'collectingResturant'], Map({
          ...action.restaurant,
          key: action.restaurant.id
        }));

    case constants.SET_DELIVERY_RESTAURANT:
      return state
        .setIn(['restaurant', 'deliveryResturant'], Map({
          ...action.restaurant,
          key: action.restaurant.id
        }));

    case constants.RESET_LIST_STATE:
      return initialState;
    default:
      return state;
  }
}
