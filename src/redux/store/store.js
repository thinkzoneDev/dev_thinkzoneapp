import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import RootReducer from '../rootReducer/RootReducer';
import RootSaga from '../rootSaga/RootSaga';

import {offline} from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

if (process.env.NODE_ENV === 'production') {
  middlewares.push(logger);
}
const store = configureStore({
  reducer: RootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({thunk: false}).concat(sagaMiddleware),
  enhancers: [offline(offlineConfig)],
});

sagaMiddleware.run(RootSaga);
export default store;
