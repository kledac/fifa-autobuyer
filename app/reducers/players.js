import _ from 'lodash';
import { SAVE_RESULTS, ADD_PLAYER, REMOVE_PLAYER, SET_PRICE } from '../actions/players';
import { savePlayerList, loadPlayerList } from '../utils/SearchUtil';

export function searchResults(state = {}, action) {
  switch (action.type) {
    case SAVE_RESULTS:
      return action.results;
    default:
      return state;
  }
}

export function playerList(state = [], action) {
  let nextState;
  switch (action.type) {
    case ADD_PLAYER:
      nextState = [...state, action.player];
      break;
    case REMOVE_PLAYER: {
      const i = state.indexOf(action.player);
      nextState = [
        ...state.slice(0, i),
        ...state.slice(i + 1)
      ];
      break;
    }
    case SET_PRICE: {
      nextState = _.merge([], state);
      _.set(_.find(nextState, { id: action.id }), 'price', action.price);
      break;
    }
    default:
      if (!state.length) {
        nextState = loadPlayerList() || [];
      } else {
        nextState = state;
      }
  }
  savePlayerList(nextState);
  return nextState;
}
