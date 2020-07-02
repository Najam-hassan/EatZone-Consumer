import { fromJS, List, Map } from 'immutable';

import * as constants from '../../actions/constants';
import { guid } from '../../utils/misc';

export const initialState = fromJS({
    list: {
        data: [],
        loading: false,
        error: null,
    },
});

export default function homeReducer (state = initialState, action) {
    switch (action.type) {
        case constants.FETCH_RESTAURENTS_REQUEST:
            return state.setIn(['user', 'loading'], true);

        case constants.FETCH_RESTAURENTS_SUCCESS: {
            const payload = List(
                action.data.map(item => {
                    const date = new Date();
                    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds}`;
                    const isValid = moment(time, "h:mm:ss").format("HH:mm:ss") < item.deliverTimeEnd &&
                        moment(time, "h:mm:ss").format("HH:mm:ss") >= item.deliverTimeStart;
                    return (
                        Map({
                            ...item,
                            isValid: isValid,
                            key: guid(),
                        })
                    )
                }),
            );
            return state.setIn(['list', 'data'], payload)
                .setIn(['list', 'loading'], false);
        }

        case constants.FETCH_RESTAURENTS_FAILURE:
            return state.setIn(['list', 'error'], action.error)
                .setIn(['list', 'loading'], false);

        case constants.RESET_LIST_STATE:
            return initialState;
        default:
            return state;
    }
}
