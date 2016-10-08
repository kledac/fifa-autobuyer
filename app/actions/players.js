import { calculateNextLowerPrice } from 'fut';
import { search as playerSearch } from '../utils/SearchUtil';
import metrics from '../utils/MetricsUtil';
import { getApi } from '../utils/ApiUtil';

export const SAVE_RESULTS = 'SAVE_RESULTS';
export const SEARCH_PLAYERS = 'SEARCH_PLAYERS';
export const ADD_PLAYER = 'ADD_PLAYER';
export const REMOVE_PLAYER = 'REMOVE_PLAYER';
export const SET_PRICE = 'SET_PRICE';

export function saveResults(results) {
  return { type: SAVE_RESULTS, results };
}

export function search(query, page = 1) {
  return dispatch => {
    playerSearch(query, page, dispatch);
  };
}

export function findPrice(id, buy = 0, num = 0) {
  return async (dispatch, getState) => {
    const { email } = getState().account;
    const api = getApi(email);
    const filter = { definitionId: id, num: 50 };
    if (buy) {
      filter.maxb = buy;
    }
    let lowest = buy;
    let total = num;
    const response = await api.search(filter);
    const prices = response.auctionInfo.map(i => i.buyNowPrice);
    if (prices.length) {
      lowest = Math.min(...prices);
      prices.filter(i => i.buyNowPrice === lowest);
      total = prices.length;
      // If we have 50 of the same result, go one lower
      if (total === 50) {
        lowest = calculateNextLowerPrice(lowest);
      }
    }
    if (buy === 0 || lowest < buy) {
      dispatch(findPrice(id, lowest, total));
    } else {
      dispatch(setPrice(id, { lowest, total }));
    }
  };
}

export function setPrice(id, price) {
  return { type: SET_PRICE, id, price };
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
