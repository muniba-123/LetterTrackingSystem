import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import auth from '../Store/reducers/auth/auth';

const appReducer = combineReducers({
  auth: auth,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

function storeToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.error('Store To Local Storage: ', err);
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

const persistedState = loadFromLocalStorage();

const composeEnhancers =
  (process.env.REACT_APP_ENV !== 'prod' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

let middleware = [thunk];
if (process.env.REACT_APP_ENV !== 'prod') {
  const { logger } = require('redux-logger');
  middleware = [...middleware, logger];
}

const configureStore = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(applyMiddleware(...middleware)),
);

configureStore.subscribe(() => {
  storeToLocalStorage(configureStore.getState());
});

export default configureStore;
