import { calculateNextLowerPrice } from 'fut';
import request from 'request';
import metrics from '../utils/MetricsUtil';
import { getApi } from '../utils/ApiUtil';

export const SAVE_SEARCH_RESULTS = 'SAVE_SEARCH_RESULTS';
export const SEARCH_PLAYERS = 'SEARCH_PLAYERS';
export const ADD_PLAYER = 'ADD_PLAYER';
export const REMOVE_PLAYER = 'REMOVE_PLAYER';
export const SET_PRICE = 'SET_PRICE';

const ENDPOINT = 'https://www.easports.com/uk/fifa/ultimate-team/api';
let searchReq = null;

export function search(query, page = 1) {
  return async dispatch => {
    if (searchReq) {
      searchReq.abort();
      searchReq = null;
    }

    searchReq = request.get(
      {
        url: `${ENDPOINT}/fut/item?`,
        qs: { jsonParamObject: JSON.stringify({ page, name: query }) }
      },
      (error, response, body) => {
        const results = JSON.parse(body);
        if (response.statusCode === 200) {
          metrics.track('Player Search', {
            query,
            results: results.totalResults
          });
          dispatch({ type: SAVE_SEARCH_RESULTS, results });
        }
      }
    );
  };
}

export function findPrice(id, buy = 0, num = 0) {
  return async (dispatch, getState) => {
    const { email } = getState().account;
    const api = getApi(email);
    if (api) {
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
