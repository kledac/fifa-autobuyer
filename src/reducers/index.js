import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { searchResults, playerList } from './players';

const rootReducer = combineReducers({
  searchResults,
  playerList,
  routing
});

export default rootReducer;
