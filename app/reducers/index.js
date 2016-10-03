import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { searchResults, playerList } from './players';
import { account } from './account';

const rootReducer = combineReducers({
  account,
  searchResults,
  playerList,
  routing
});

export default rootReducer;
