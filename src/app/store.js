import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import projectReducer from './reducers/projectReducer';
import userReducer from './reducers/userReducer';

const reducer = combineReducers({
  projects: projectReducer,
  user: userReducer
});

const store = () => {
  return createStore(reducer, applyMiddleware(thunk));
};

export default store;