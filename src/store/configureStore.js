import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import profile from '../reducers/profile';

const rootReducer = combineReducers({
  user: profile
});

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;