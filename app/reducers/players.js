import _ from 'lodash';
import { SAVE_SEARCH_RESULTS, ADD_PLAYER, REMOVE_PLAYER, SET_PRICE } from '../actions/players';

export function players(state = {}, action) {
  switch (action.type) {
    case SAVE_SEARCH_RESULTS: {
      const nextState = _.merge({}, state);
      _.set(nextState, 'search', action.results);
      return nextState;
    }
    case ADD_PLAYER: {
      const nextState = _.merge({}, state);
      _.set(nextState, `list.${action.player.id}`, action.player);
      return nextState;
    }
    case REMOVE_PLAYER: {
      const nextState = _.merge({}, state);
      _.unset(nextState, `list.${action.player.id}`);
      return nextState;
    }
    case SET_PRICE: {
      const nextState = _.merge({}, state);
      _.set(nextState, `list.${action.id}.price`, action.price);
      return nextState;
    }
    default:
      return state;
  }
}

export { players as default };
