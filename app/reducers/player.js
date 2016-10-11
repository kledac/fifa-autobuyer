import _ from 'lodash';
import * as types from '../actions/playerTypes';

export function player(state = {}, action) {
  switch (action.type) {
    case types.SAVE_SEARCH_RESULTS: {
      const nextState = _.merge({}, state);
      _.set(nextState, 'search', action.results);
      return nextState;
    }
    case types.ADD_PLAYER: {
      const nextState = _.merge({}, state);
      // if we don't have a list yet, make it an object
      if (!nextState.list) nextState.list = {};
      _.set(nextState, `list.${action.player.id}`, action.player);
      return nextState;
    }
    case types.REMOVE_PLAYER: {
      const nextState = _.merge({}, state);
      _.unset(nextState, `list.${action.player.id}`);
      return nextState;
    }
    case types.SET_PRICE: {
      const nextState = _.merge({}, state);
      _.set(nextState, `list.${action.id}.price`, action.price);
      return nextState;
    }
    default:
      return state;
  }
}

export { player as default };
