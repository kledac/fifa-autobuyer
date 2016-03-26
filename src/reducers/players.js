import { SAVE_RESULTS } from '../actions/players';

export default function searchResults(state = {}, action) {
  switch (action.type) {
    case SAVE_RESULTS:
      return action.results;
    default:
      return state;
  }
}
