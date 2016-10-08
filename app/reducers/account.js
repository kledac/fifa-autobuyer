import _ from 'lodash';
import { SET_ACCOUNT_INFO, SET_CREDITS } from '../actions/account';

export function account(state = {}, action) {
  let nextState;
  switch (action.type) {
    case SET_ACCOUNT_INFO:
      nextState = _.merge({}, state);
      nextState[action.key] = action.value;
      return nextState;
    case SET_CREDITS:
      return _.merge({}, state, {
        credits: action.credits
      });
    default:
      return state;
  }
}

export { account as default };
