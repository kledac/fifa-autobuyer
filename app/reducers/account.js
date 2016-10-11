import _ from 'lodash';
import * as types from '../actions/accountTypes';

export function account(state = {}, action) {
  let nextState;
  switch (action.type) {
    case types.SET_ACCOUNT_INFO:
      nextState = _.merge({}, state);
      nextState[action.key] = action.value;
      return nextState;
    case types.SET_CREDITS:
      return _.merge({}, state, {
        credits: action.credits
      });
    default:
      return state;
  }
}

export { account as default };
