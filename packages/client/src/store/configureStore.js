import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';
import { createGameLoop } from './enhancers/loop/createGameLoop';
import { actionTypes as loopActionTypes } from './enhancers/loop/actions';

const configureStore = preloadedState => {
  const ignoredActionTypes = [loopActionTypes.TICK_LOOP];
  const loggerMiddleware = createLogger({
    collapsed: true,
    predicate: (getState, { type }) => !ignoredActionTypes.includes(type) // eslint-disable-line no-unused-vars
  });
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [thunkMiddleware, sagaMiddleware, loggerMiddleware];
  const enhancers = [createGameLoop(), applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose;
  /* eslint-enable */

  const store = createStore(rootReducer, preloadedState, composeEnhancers(...enhancers));

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./rootReducer', () => {
      store.replaceReducer(rootReducer);
    });
  }

  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureStore;
