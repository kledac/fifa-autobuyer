import _ from 'lodash';
import moment from 'moment';
import Fut from 'fut-promise';
import request from 'request';
import * as types from './bidTypes';
import cycle from './logic';
import { getApi } from '../utils/ApiUtil';
import { setCredits } from './account';
import { findPrice } from './player';

const filter = {
  type: 'player',
  start: 0,
  num: 16,
};

// Disable console.log and console.error in unit tests
const logger = {
  log: console.log,
  warn: console.warn,
  error: console.error
};
if (process.env.NODE_ENV === 'test') {
  logger.log = () => {};
  logger.warn = () => {};
  logger.error = () => {};
}

let cycleTimeout;
let marketRequest;

export function start() {
  return async dispatch => {
    dispatch({ type: types.START_BIDDING });
    dispatch(setCycleCount(0));
    await dispatch(cycle());
  };
}

export function setCycleCount(count = 0) {
  return { type: types.SET_CYCLES, count };
}

export function setWatched(watched) {
  return { type: types.SET_WATCH, watched };
}

export function updateWatched(id, count) {
  return { type: types.UPDATE_WATCH, id, count };
}

export function setListed(listed) {
  return { type: types.SET_LISTED, listed };
}

export function updateListed(id, count) {
  return { type: types.UPDATE_LISTED, id, count };
}

export function setTrades(trades) {
  return { type: types.SET_TRADES, trades };
}

export function updateTrades(id, tradeResult) {
  return { type: types.UPDATE_TRADES, id, tradeResult };
}

export function setBINStatus(won) {
  return { type: types.SET_BIN_STATUS, won };
}

export function snipe(player, settings) {
  return async (dispatch, getState) => {
    let state = getState();
    const api = getApi(state.account.email);
    logger.log('Preparing to snipe...');
    // Snipe
    const binFilter = _.merge({}, filter, {
      definitionId: player.id,
      maxb: player.price.buy,
    });
    let binResponse;
    try {
      binResponse = await api.search(binFilter);
    } catch (e) {
      logger.error('Error searching for BIN', e);
      binResponse = { auctionInfo: [] };
    }
    logger.log(`${binResponse.auctionInfo.length} BIN found...`);
    for (const trade of binResponse.auctionInfo) {
      // refresh state every trade
      state = getState();
      if (
        // We are still bidding
        state.bid.bidding
        // We have enough credits
        && state.account.credits > settings.minCredits
        // We are below our cap for this player
        && _.get(state, `bid.listed.${player.id}`, 0) < settings.maxCard
        // The card has at least one contract
        && trade.itemData.contract > 0
      ) {
        // Buy it!
        let tradeResult = {};
        try {
          const snipeResponse = await api.placeBid(trade.tradeId, trade.buyNowPrice);
          dispatch(setCredits(snipeResponse.credits));
          tradeResult = _.get(snipeResponse, 'auctionInfo[0]', {});
        } catch (e) {
          logger.error('Error placing BIN bid', e);
        }
        // tradeResult = {
        //   bidState: 'buyNow',
        //   tradeState: 'closed',
        //   tradeId: trade.tradeId,
        //   currentBid: trade.buyNowPrice
        // };
        // Was this a success?
        if (tradeResult.tradeState === 'closed' && tradeResult.bidState === 'buyNow') {
          logger.log(`Bought for BIN (${trade.buyNowPrice}) on ${trade.tradeId}`);
          dispatch(setBINStatus(true));
          // Increment number of trades won
          if (state.bid.listed[player.id] === undefined) {
            // listed[player.id] = 1;
            dispatch(updateListed(player.id, 1));
          } else {
            // listed[player.id] += 1;
            dispatch(updateListed(player.id, state.bid.listed[player.id] + 1));
          }
        } else {
          // TODO: do something about this
          logger.warn(`Could not snipe ${trade.tradeId}`);
        }
      }
    }
  };
}

export function placeBid(player, settings) {
  return async (dispatch, getState) => {
    if (!settings.snipeOnly) {
      let state = getState();
      const api = getApi(state.account.email);
      logger.log('Getting ready to search auctions...');
      const bidFilter = _.merge({}, filter, {
        definitionId: player.id,
        macr: player.price.buy,
      });
      let searchResults = 0;
      let last5Min = [];
      try {
        const bidResponse = await api.search(bidFilter);
        searchResults = bidResponse.auctionInfo.length;
        last5Min = _.filter(bidResponse.auctionInfo, trade => trade.expires <= 300);
      } catch (e) {
        logger.error('Error searching auctions', e);
      }
      logger.log(`${searchResults} results (${last5Min.length} in last 5 minutes)`);
      if (searchResults > 0 && last5Min.length === searchResults) {
        // TODO: Increment page number and search again
      }
      for (const trade of last5Min) {
        // refresh state every trade
        state = getState();
        const listed = _.get(state.bid.listed, player.id, 0);
        if (
          // We are still bidding
          state.bid.bidding
          // We haven't placed too many bids
          // (Twice as many as max card - listed, assuming 50% win chance)
          && _.get(state.bid.watched, player.id, 0) < (settings.maxCard - listed) * 2
          // TODO: Keep track of how long we are inside this loop to set the
          //       lower limit, ensuring we do not attempt to bid on expired
          //       items.
          && trade.expires > 0
          // We have enough credits
          && state.account.credits > settings.minCredits
          // We are below our cap for this player
          && listed < settings.maxCard
          // We are not bidding on something that is already active in our watchlist
          && state.bid.trades[trade.tradeId] === undefined
          // The card has at least one contract
          && trade.itemData.contract > 0
        ) {
          // Set our bid
          let bid;
          if (trade.currentBid) {
            bid = Fut.calculateNextHigherPrice(trade.currentBid);
          } else {
            bid = trade.startingBid;
          }

          // Make sure we aren't trying to spend more than we want to
          if (bid <= player.price.buy) {
            // Bid!
            let tradeResult = {};
            try {
              const placeBidResponse = await api.placeBid(trade.tradeId, bid);
              dispatch(setCredits(placeBidResponse.credits));
              tradeResult = _.get(placeBidResponse, 'auctionInfo[0]', {});
            } catch (e) {
              logger.error('Error placing bid on auction', e);
            }
            // tradeResult = {
            //   bidState: 'highest',
            //   tradeId: trade.tradeId,
            //   currentBid: bid
            // };
            // Was this a success?
            if (tradeResult.bidState === 'highest') {
              logger.log(`Bidding ${bid} on ${trade.tradeId}`);
              // Add it to watched trades for listing and update our local watchlist
              // trades[tradeResult.tradeId] = tradeResult;
              dispatch(updateListed(tradeResult.tradeId, tradeResult));
              dispatch(setWatchlist(Object.values(state.bid.trades)));
              // Increment number of trades watched
              if (state.bid.watched[player.id] === undefined) {
                // state.bid.watched[player.id] = 1;
                dispatch(updateWatched(player.id, 1));
              } else {
                // state.bid.watched[player.id] += 1;
                dispatch(updateWatched(player.id, state.bid.watched[player.id] + 1));
              }
            } else {
              // TODO: do something about this
              logger.warn(`Something happened when trying to bid on ${trade.tradeId}`);
            }
          }
        }
      }
    } else {
      logger.log('No Bids, only Snipes');
    }
  };
}

export function updateItems(player, settings) {
  return async (dispatch, getState) => {
    let state = getState();
    const api = getApi(state.account.email);
    if (state.bid.bidding) {
      // Update watched items
      await dispatch(getWatchlist(state.account.email));
      state = getState();
      // update our watched trades for this part
      // trades = _.keyBy(state.bid.watchlist, 'tradeId');
      dispatch(setTrades(_.keyBy(state.bid.watchlist, 'tradeId')));
      // refresh state again
      state = getState();
      const tradeIds = Object.keys(state.bid.trades);
      if (!settings.snipeOnly && tradeIds.length) {
        let statuses;
        try {
          statuses = await api.getStatus(tradeIds);
          dispatch(setCredits(statuses.credits));
        } catch (e) {
          logger.error('Error getting trade statuses', e);
          statuses = { auctionInfo: [] };
        }
        for (const item of statuses.auctionInfo) {
          const baseId = Fut.getBaseId(state.bid.trades[item.tradeId].itemData.resourceId);
          const trackedPlayer = _.get(state.player, `list.${baseId}`, false);

          // Only continue if we are tracking this player, and know about this trade
          if (trackedPlayer && state.bid.trades[item.tradeId]) {
            // Handle Expired Items
            if (item.expires === -1) {
              if (item.bidState === 'highest' || (item.tradeState === 'closed' && item.bidState === 'buyNow')) {
                // We won! Send to Pile!
                let pileResponse;
                try {
                  pileResponse = await api.sendToTradepile(item.itemData.id);
                } catch (e) {
                  logger.error('Error sending won auction to tradepile', e);
                  pileResponse = { itemData: [{ success: false }] };
                }
                if (pileResponse.itemData[0].success) {
                  // List on market
                  try {
                    await api.listItem(
                      item.itemData.id,
                      trackedPlayer.price.sell,
                      trackedPlayer.price.bin,
                      3600);
                    dispatch(updateListed(baseId, state.bid.listed[baseId] + 1));
                    dispatch(updateHistory(baseId, {
                      id: item.itemData.id,
                      bought: item.currentBid,
                      boughtAt: Date.now()
                    }));
                  } catch (e) {
                    logger.error('Error listing won auction for sale', e);
                  }
                }
              } else {
                // Delete from watchlist, we lost
                try {
                  await api.removeFromWatchlist(item.tradeId);
                  const trades = state.bid;
                  delete trades[item.tradeId];
                  dispatch(setWatchlist(Object.values(trades)));
                } catch (e) {
                  logger.error('Error removing lost auction from watchlist', e);
                }
              }
            } else if (item.bidState !== 'highest') {
              state = getState();
              // We were outbid
              const newBid = Fut.calculateNextHigherPrice(item.currentBid);
              if (
                newBid > trackedPlayer.price.buy
                || state.bid.listed[baseId] >= settings.maxPlayer
              ) {
                // Remove from list if new bid is too high, or we already have too many listed
                try {
                  await api.removeFromWatchlist(item.tradeId);
                  const trades = state.bid;
                  delete trades[item.tradeId];
                  dispatch(setWatchlist(Object.values(trades)));
                } catch (e) {
                  logger.error('Error removing outbid item from watchlist', e);
                }
              } else if (state.account.credits > settings.minCredits) {
                // Only continue if we have enough credits
                let tradeResult = {};
                try {
                  const placeBidResponse = await api.placeBid(item.tradeId, newBid);
                  dispatch(setCredits(placeBidResponse.credits));
                  tradeResult = _.get(placeBidResponse, 'auctionInfo[0]', {});
                } catch (e) {
                  logger.error('Error placing additional bid on item', e);
                }
                if (tradeResult.bidState !== 'highest') {
                  // TODO: do something about this
                  logger.warn(`Something happened when trying to bid on ${tradeResult.tradeId}`);
                }
              }
            }
          }
        }
      }

      // buy now goes directly to unassigned now
      if (state.bid.binWon) {
        await dispatch(getUnassigned(state.account.email));
        state = getState();
        dispatch(setBINStatus(!!state.bid.unassigned.length));
        for (const i of state.bid.unassigned) {
          const baseId = Fut.getBaseId(i.resourceId);
          const trackedPlayer = _.get(state.player, `list.${baseId}`, false);
          if (trackedPlayer) {
            // Send it to the tradepile
            let pileResponse;
            try {
              pileResponse = await api.sendToTradepile(i.id);
            } catch (e) {
              logger.error('Error sending won BIN to tradepile', e);
              pileResponse = { itemData: [{ success: false }] };
            }
            if (pileResponse.itemData[0].success) {
              try {
                await api.listItem(
                  i.id,
                  trackedPlayer.price.sell,
                  trackedPlayer.price.bin,
                  3600);
                dispatch(updateListed(baseId, state.bid.listed[baseId] + 1));
                dispatch(updateHistory(baseId, {
                  id: i.id,
                  bought: i.lastSalePrice,
                  boughtAt: Date.now()
                }));
              } catch (e) {
                logger.error('Error listing won BIN for sale', e);
              }
            }
          }
        }
      }

      // Relist expired trades (and list new ones if needed)
      const expired = state.bid.tradepile.filter(i => i.tradeState === 'expired');
      if (expired.length > 0) {
        logger.log('Re-listing expired items');
        let relistFailed = false;
        if (settings.relistAll) {
          try {
            const relist = await api.relist();
            if (relist.code === 500) {
              relistFailed = true;
            }
          } catch (e) {
            logger.error('Error attempting to relist all auctions', e);
            relistFailed = true;
          }
        }
        // Relist all failed? Do it manually.
        if (!settings.relistAll || relistFailed) {
          logger.log(`Manually re-listing ${expired.length} players.`);
          for (const i of expired) {
            const baseId = Fut.getBaseId(i.itemData.resourceId);
            const priceDetails = _.get(state.player, `list.${baseId}.price`, false);
            try {
              if (!settings.relistAll && priceDetails) {
                await api.listItem(i.itemData.id, priceDetails.sell, priceDetails.bin, 3600);
              } else {
                await api.listItem(i.itemData.id, i.startingBid, i.buyNowPrice, 3600);
              }
            } catch (e) {
              logger.error('Error manually re-listing player', e);
            }
          }
        }
      }

      // Log sold items
      const sold = state.bid.tradepile.filter(i => i.tradeState === 'closed');
      if (sold.length > 0) {
        for (const i of sold) {
          // Is this a card we are tracking?
          const baseId = Fut.getBaseId(i.itemData.resourceId);
          const trackedPlayer = _.get(state.player, `list.${baseId}`, false);
          if (trackedPlayer) {
            dispatch(updateHistory(baseId, {
              id: i.itemData.id,
              sold: i.currentBid,
              soldAt: Date.now()
            }));
          }
          try {
            await api.removeFromTradepile(i.tradeId);
          } catch (e) {
            logger.error('Error removing sold item from tradepile', e);
          }
        }
        // Update tradepile when done
        await dispatch(getTradepile(state.account.email));
      }
    }
  };
}

export function keepBidding() {
  return async (dispatch, getState) => {
    const state = getState();
    if (state.bid.bidding) {
      if (
        // We don't have enough credits
        state.account.credits < state.settings.minCredits
        // We aren't watching any auctions
        && !state.bid.watchlist.length
        // We have some players listed
        && state.bid.tradepile.length
      ) {
        const timeout = state.bid.tradepile.reduce(
          (a, b) => (a < b.expires ? a : b.expires),
          60 // Wait a maximum of 60 seconds
        ) * 1000;
        logger.log(`Waiting ${timeout / 1000} seconds before continuing...`);
        cycleTimeout = window.setTimeout(() => {
          dispatch(cycle());
        }, timeout);
      } else {
        logger.log('Good to keep bidding');
        await dispatch(cycle());
      }
    }
  };
}

export function updatePrice(player, settings) {
  return async dispatch => {
    const price = _.get(player, 'price', {});
    if (settings.autoUpdate) {
      const lastUpdated = moment(price.updated || 0);
      if (!price.buy || moment().isAfter(lastUpdated.add(1, 'h'))) {
        logger.log('Updating price...');
        await dispatch(findPrice(player.id));
      } else {
        logger.log('Price already up to date...');
      }
    }
  };
}

export function getTradepile(email) {
  return async dispatch => {
    const api = getApi(email);
    const response = await api.getTradepile();
    dispatch(setCredits(response.credits));
    dispatch({ type: types.SET_TRADEPILE, tradepile: response.auctionInfo });
  };
}

export function getWatchlist(email) {
  return async dispatch => {
    const api = getApi(email);
    const response = await api.getWatchlist();
    dispatch(setCredits(response.credits));
    dispatch(setWatchlist(response.auctionInfo));
  };
}

export function setWatchlist(watchlist) {
  return { type: types.SET_WATCHLIST, watchlist };
}

export function getUnassigned(email) {
  return async dispatch => {
    const api = getApi(email);
    const response = await api.getUnassigned();
    dispatch(setCredits(response.credits));
    dispatch({ type: types.SET_UNASSIGNED, unassigned: response.itemData });
  };
}

export function updateHistory(id, history) {
  return { type: types.UPDATE_PLAYER_HISTORY, id, history };
}

export function getMarketData(platform, type = 'live_graph', playerId = null) {
  return async dispatch => {
    if (marketRequest) {
      marketRequest.abort();
      marketRequest = null;
    }
    return new Promise((resolve, reject) => {
      let url = 'https://www.futbin.com/pages/market/graph.php?';
      let qs = { type, console: platform.toUpperCase(), _: moment.utc().valueOf() };
      if (playerId) {
        url = 'https://www.futbin.com/pages/player/graph.php?';
        qs = { type, year: 17, player: playerId, _: moment.utc().valueOf() };
      }
      marketRequest = request.get(
        { url, qs },
        (error, response, body) => {
          if (error) {
            reject(error);
          }
          const json = JSON.parse(body);
          if (response.statusCode === 200) {
            resolve(json);
          }
        }
      );
    }).then(results => {
      const market = { title: results.title, flags: results.flags };
      switch (platform) {
        case 'xone':
        case 'x360':
          market.data = results.xbox;
          break;
        default:
          market.data = results.ps;
          break;
      }
      // Map flags
      const fillFlagColor = function fillFlagColor(design) {
        let graphColorArr = [];
        switch (design) {
          case '1':
            graphColorArr = ['#000', '#000', '#dcb20a'];
            break;
          case '2':
            graphColorArr = ['#046aaf', '#046aaf', '#fff'];
            break;
          case '3':
            graphColorArr = ['#00591b', '#00591b', '#fff'];
            break;
          case '4':
            graphColorArr = ['#6099e6', '#6099e6', '#fff'];
            break;
          case '5':
            graphColorArr = ['#4f3581', '#4f3581', '#fff'];
            break;
          default:
            graphColorArr = ['#fff', '#000'];
            break;
        }
        return graphColorArr;
      };
      market.flags = market.flags.map(flag => {
        const colorArray = fillFlagColor(flag.design);
        return {
          x: moment.utc(flag.flag_date).valueOf(),
          title: flag.title,
          text: flag.description,
          color: colorArray[0],
          fillColor: colorArray[1],
          style: {
            color: colorArray[2],
            borderRadius: 5
          }
        };
      });
      dispatch({ type: types.SAVE_MARKET_DATA, market });
    });
  };
}

export function stop() {
  if (cycleTimeout) {
    window.clearTimeout(cycleTimeout);
    cycleTimeout = undefined;
  }
  return { type: types.STOP_BIDDING };
}
