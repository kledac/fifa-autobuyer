import _ from 'lodash';
import moment from 'moment';
import Fut from 'fut-promise';
import * as types from './bidTypes';
import { getApi } from '../utils/ApiUtil';
import { setCredits } from './account';
import { findPrice } from './player';

const filter = {
  type: 'player',
  start: 0,
  num: 50,
};

export function addMessage(msg) {
  return { type: types.ADD_MESSAGE, timestamp: new Date(), msg };
}

export function start() {
  return dispatch => {
    dispatch({ type: types.START_BIDDING });
    dispatch(setCycleCount(0));
    dispatch(cycle());
  };
}

export function setCycleCount(count = 0) {
  return { type: types.SET_CYCLES, count };
}

export function cycle() {
  return async (dispatch, getState) => {
    let state = getState();

    dispatch(setCycleCount(state.bid.cycles + 1));

    // Get the player list
    const playerList = state.player.list;

    // Get current tradepile and watchlist
    await dispatch(getTradepile(state.account.email));
    await dispatch(getWatchlist(state.account.email));

    // Keep a manual record of our watched trades
    const trades = _.groupBy(state.bid.watchlist, 'tradeId');

    // Loop players
    await _.forEach(playerList, async player => {
      // refresh state every player
      state = getState();

      // Setup API
      const settings = _.merge({}, state.settings, player.settings);
      const api = getApi(state.account.email, settings.rpm);

      // How many of this player is already listed
      const listed = _.countBy(
        state.bid.tradepile,
        trade => Fut.getBaseId(trade.itemData.resourceId)
      );
      const watched = _.countBy(
        state.bid.watchlist,
        trade => Fut.getBaseId(trade.itemData.resourceId)
      );

      // Update prices every hour if auto update price is enabled
      const price = player.price || {};
      if (settings.autoUpdate) {
        const lastUpdated = moment(price.updated || 0);
        if (!price.buy || moment().isAfter(lastUpdated.add(1, 'h'))) {
          console.log('Updating price...');
          await dispatch(findPrice(player.id));
        } else {
          console.log('Price already up to date...');
        }
      }

      // Only bid if we don't already have a full trade pile and don't own too many of this player
      if (
        state.bid.bidding
        && state.bid.tradepile.length < state.account.pilesize.tradepile
        && state.account.credits > settings.minCredits
        && _.get(listed, player.id, 0) < settings.maxCard
      ) {
        console.log('Preparing to snipe...');
        // Snipe
        const binFilter = _.merge({}, filter, {
          definitionId: player.id,
          maxb: player.price.buy,
        });
        const binResponse = await api.search(binFilter);
        console.log(`${binResponse.auctionInfo.length} BIN found...`);
        for (const trade of binResponse.auctionInfo) {
          // refresh state every trade
          state = getState();
          if (
            // We are still bidding
            state.bid.bidding
            // We have enough credits
            && state.account.credits > settings.minCredits
            // We are below our cap for this player
            && _.get(listed, player.id, 0) < settings.maxCard
            // We are not bidding on something that is already active in our watchlist
            && trades[trade.tradeId] === undefined
            // The card has at least one contract
            && trade.itemData.contract > 0
          ) {
            // Buy it!
            console.log(`Bought for BIN (${trade.buyNowPrice}) on ${trade.tradeId}`);
            const snipeResponse = await api.placeBid(trade.tradeId, trade.buyNowPrice);
            dispatch(setCredits(snipeResponse.credits));
            const tradeResult = snipeResponse.auctionInfo[0] || {};
            // const tradeResult = {
            //   bidState: 'buyNow',
            //   tradeState: 'closed',
            //   tradeId: trade.tradeId,
            //   currentBid: trade.buyNowPrice
            // };
            // Was this a success?
            if (tradeResult.tradeState === 'closed' && tradeResult.bidState === 'buyNow') {
              // Add it to watched trades for listing
              trades[tradeResult.tradeId] = trade;
              // Increment number of trades won
              if (listed[player.id] === undefined) {
                listed[player.id] = 1;
              } else {
                listed[player.id] += 1;
              }
            } else {
              // TODO: do something about this
            }
          }
        }

        // Place bids
        if (!settings.snipeOnly) {
          console.log('Getting ready to search auctions...');
          const bidFilter = _.merge({}, filter, {
            definitionId: player.id,
            macr: player.price.buy,
          });
          const bidResponse = await api.search(bidFilter);
          const last5Min = _.filter(bidResponse.auctionInfo, trade => trade.expires <= 300);
          console.log(`${bidResponse.auctionInfo.length} results (${last5Min.length} in last 5 minutes)`);
          if (last5Min.length === bidResponse.auctionInfo.length) {
            // TODO: Increment page number and search again
          }
          for (const trade of last5Min) {
            // refresh state every trade
            state = getState();
            if (
              // We are still bidding
              state.bid.bidding
              // We haven't placed too many bids
              // (Twice as many as max card, assuming 50% win chance)
              && _.get(watched, player.id, 0) < (settings.maxCard * 2)
              // TODO: Keep track of how long we are inside this loop to set the
              //       lower limit, ensuring we do not attempt to bid on expired
              //       items.
              && trade.expires > 0
              // We have enough credits
              && state.account.credits > settings.minCredits
              // We are below our cap for this player
              && _.get(listed, player.id, 0) < settings.maxCard
              // We are not bidding on something that is already active in our watchlist
              && trades[trade.tradeId] === undefined
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
                console.log(`Bidding ${bid} on ${trade.tradeId}`);
                const placeBidResponse = await api.placeBid(trade.tradeId, bid);
                dispatch(setCredits(placeBidResponse.credits));
                const tradeResult = placeBidResponse.auctionInfo[0] || {};
                // const tradeResult = {
                //   bidState: 'highest',
                //   tradeId: trade.tradeId,
                //   currentBid: bid
                // };
                // Was this a success?
                if (tradeResult.bidState === 'highest') {
                  // Add it to watched trades for listing
                  trades[tradeResult.tradeId] = trade;
                  // Increment number of trades watched
                  if (watched[player.id] === undefined) {
                    watched[player.id] = 1;
                  } else {
                    watched[player.id] += 1;
                  }
                } else {
                  // TODO: do something about this
                  console.warn(`Something happened when trying to bid on ${tradeResult.tradeId}`);
                }
              }
            }
          }

          // TODO: Update trades
        }
      }
    });
    // keep going
    if (state.bid.bidding) {
      dispatch(cycle());
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
    dispatch({ type: types.SET_WATCHLIST, watchlist: response.auctionInfo });
  };
}

export function getUnassigned(email) {
  return async dispatch => {
    const api = getApi(email);
    const response = await api.getUnassigned();
    dispatch(setCredits(response.credits));
    dispatch({ type: types.SET_UNASSIGNED, unassigned: response.itemData });
  };
}

export function stop() {
  return { type: types.STOP_BIDDING };
}
