import Fut from 'fut';
import request from 'request';
import Promise from 'bluebird';
import * as types from './playerTypes';
import metrics from '../utils/MetricsUtil';
import { getApi } from '../utils/ApiUtil';

const ENDPOINT = 'https://www.easports.com/uk/fifa/ultimate-team/api';
let searchReq = null;

export function search(query, page = 1) {
  return async dispatch => {
    if (searchReq) {
      searchReq.abort();
      searchReq = null;
    }

    return new Promise((resolve, reject) => {
      searchReq = request.get(
        {
          url: `${ENDPOINT}/fut/item?`,
          qs: { jsonParamObject: JSON.stringify({ page, name: query }) }
        },
        (error, response, body) => {
          if (error) {
            reject(error);
          }
          const json = JSON.parse(body);
          if (response.statusCode === 200) {
            metrics.track('Player Search', {
              query,
              results: json.totalResults
            });
            resolve(json);
          }
        }
      );
    }).then(results => {
      dispatch({ type: types.SAVE_SEARCH_RESULTS, results });
    });
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
          lowest = Fut.calculateNextLowerPrice(lowest);
        }
      }
      if (buy === 0 || lowest < buy) {
        await dispatch(findPrice(id, lowest, total));
      } else {
        dispatch(setPrice(id, { lowest, total }));
      }
    }
  };
}

export function setPrice(id, price) {
  return { type: types.SET_PRICE, id, price };
}

export function add(player) {
  metrics.track('Add Player', {
    id: player.id,
    name: player.name
  });
  return { type: types.ADD_PLAYER, player };
}

export function remove(player) {
  metrics.track('Remove Player', {
    id: player.id,
    name: player.name
  });
  return { type: types.REMOVE_PLAYER, player };
}
