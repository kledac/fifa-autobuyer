import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { player } from './player';
import { account } from './account';
import { settings } from './settings';

const rootReducer = combineReducers({
  account,
  player,
  settings,
  routing
});

export default rootReducer;
