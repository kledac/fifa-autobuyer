import { search as playerSearch } from '../utils/SearchUtil';

export const SAVE_RESULTS = 'SAVE_RESULTS';
export const SEARCH_PLAYERS = 'SEARCH_PLAYERS';

export function saveResults(results) {
  return { type: SAVE_RESULTS, results };
}

export function search(query, page = 1) {
  return dispatch => {
    playerSearch(query, page, dispatch);
  };
}
