import { search as playerSearch } from '../utils/SearchUtil';
import metrics from '../utils/MetricsUtil';

export const SAVE_RESULTS = 'SAVE_RESULTS';
export const SEARCH_PLAYERS = 'SEARCH_PLAYERS';
export const ADD_PLAYER = 'ADD_PLAYER';
export const REMOVE_PLAYER = 'REMOVE_PLAYER';

export function saveResults(results) {
  return { type: SAVE_RESULTS, results };
}

export function search(query, page = 1) {
  return dispatch => {
    playerSearch(query, page, dispatch);
  };
}

export function add(player) {
  metrics.track('Add Player', {
    id: player.id,
    name: player.name
  });
  return { type: ADD_PLAYER, player };
}

export function remove(player) {
  metrics.track('Remove Player', {
    id: player.id,
    name: player.name
  });
  return { type: REMOVE_PLAYER, player };
}
