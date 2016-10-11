import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { player } from './player';
import { account } from './account';

const rootReducer = combineReducers({
  account,
  player,
  routing
});

export default rootReducer;
