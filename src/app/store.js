import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import getReducer from './reducers/get';

const reducer = combineReducers({
  get: getReducer
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;