import { isEmpty } from 'lodash';
import { SET_ACCOUNT_INFO, SET_CREDITS, SAVE_ACCOUNT } from '../actions/account';
import { saveAccount, loadAccount } from '../utils/ApiUtil';

export function account(state = {}, action) {
  let nextState;
  switch (action.type) {
    case SET_ACCOUNT_INFO:
      nextState = Object.assign({}, state);
      nextState[action.key] = action.value;
      return nextState;
    case SET_CREDITS:
      return Object.assign({}, state, {
        credits: action.credits
      });
    case SAVE_ACCOUNT:
      nextState = {
        email: action.account.email,
        password: action.account.password,
        secret: action.account.secret,
        platform: action.account.platform
      };
      saveAccount(nextState);
      return nextState;
    default:
      if (isEmpty(state)) {
        nextState = loadAccount() || {};
      } else {
        nextState = state;
      }
      return nextState;
  }
}

export { account as default };
