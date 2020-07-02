import thunk from 'redux-thunk';
import { setupRNListener } from 'react-native-redux-listener';
import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from '../reducers';

export default function configureStore () {

    /* ------------- Create Redux Store ------------- */
    const store = createStore(
        rootReducer(),
        composeWithDevTools(compose(
            applyMiddleware(thunk),
            setupRNListener({
                monitorAppState: false,
                monitorNetInfo: true,
                monitorKeyboard: false,
                monitorDeepLinks: false,
                monitorBackButton: false,
            }),
        )),
    );
    return store;
}
