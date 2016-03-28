import { SAVE_RESULTS, ADD_PLAYER, REMOVE_PLAYER } from '../actions/players';

export function searchResults(state = {}, action) {
  switch (action.type) {
    case SAVE_RESULTS:
      return action.results;
    default:
      return state;
  }
}

export function playerList(state = [], action) {
  switch (action.type) {
    case ADD_PLAYER:
      return [...state, action.player];
    case REMOVE_PLAYER: {
      const i = state.indexOf(action.player);
      return [
        ...state.slice(0, i),
        ...state.slice(i + 1)
      ];
    }
    default:
      return state;
  }
}
