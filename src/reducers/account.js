import { SET_CREDITS } from '../actions/account';

export function account(state = {}, action) {
  switch (action.type) {
    case SET_CREDITS:
      return Object.assign({}, state, {
        credits: action.credits
      });
    default:
      return state;
  }
}
