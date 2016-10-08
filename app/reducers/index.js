import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { players } from './players';
import { account } from './account';

const rootReducer = combineReducers({
  account,
  players,
  routing
});

export default rootReducer;
