import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import searchResults from './players';

const rootReducer = combineReducers({
  searchResults,
  routing
});

export default rootReducer;
