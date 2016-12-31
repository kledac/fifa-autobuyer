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

    // Get unassigned on first cycle
    if (state.bid.cycles === 0) {
      await dispatch(getUnassigned(state.account.email));
      state = getState();
    }

    // Increment cycle count
    dispatch(setCycleCount(state.bid.cycles + 1));

    // Get the player list
    const playerList = state.player.list;

    // Get current tradepile and watchlist
    await dispatch(getTradepile(state.account.email));
    await dispatch(getWatchlist(state.account.email));

    // Keep a manual record of our watched trades
    const trades = _.keyBy(state.bid.watchlist, 'tradeId');

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
      let binWon = !!state.bid.unassigned.length;
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
              console.log(`Bought for BIN (${trade.buyNowPrice}) on ${trade.tradeId}`);
              binWon = true;
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
              console.warn(`Could not snipe ${trade.tradeId}`);
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
                  console.log(`Bidding ${bid} on ${trade.tradeId}`);
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
        }
      }

      // Update items always when bidding
      if (state.bid.bidding) {
        // Update watched items
        const tradeIds = Object.keys(trades);
        if (!settings.snipeOnly && tradeIds.length) {
          const statuses = await api.getStatus(tradeIds);
          dispatch(setCredits(statuses.credits));
          for (const item of statuses.auctionInfo) {
            console.log(item);
            const baseId = Fut.getBaseId(trades[item.tradeId].itemData.resourceId);
            const trackedPlayer = _.get(state.player, `list.${baseId}`, false);

            // Only continue if we are tracking this player, and know about this trade
            if (trackedPlayer && trades[item.tradeId]) {
              // Handle Expired Items
              if (item.expires === -1) {
                if (item.bidState === 'highest' || (item.tradeState === 'closed' && item.bidState === 'buyNow')) {
                  // We won! Send to Pile!
                  const pileResponse = await api.sendToTradepile(item.itemData.id);
                  if (pileResponse.itemData[0].success) {
                    // List on market
                    await api.listItem(
                      item.itemData.id,
                      trackedPlayer.price.sell,
                      trackedPlayer.price.bin,
                      3600);
                    listed[baseId] += 1;
                  }
                } else {
                  // Delete from watchlist, we lost
                  await api.removeFromWatchlist(item.tradeId);
                  delete trades[item.tradeId];
                }
              } else if (item.bidState !== 'highest') {
                state = getState();
                // Only continue if we don't have too many listed and we have enough credits
                if (listed[baseId] < settings.maxPlayer
                  && state.account.credits > settings.minCredits) {
                  // We were outbid
                  const newBid = Fut.calculateNextHigherPrice(item.currentBid);
                  if (newBid > trackedPlayer.price.bid) {
                    await api.watchlistDelete(item.tradeId);
                    delete trades[item.tradeId];
                  } else {
                    const placeBidResponse = await api.placeBid(item.tradeId, newBid);
                    dispatch(setCredits(placeBidResponse.credits));
                    const tradeResult = placeBidResponse.auctionInfo[0] || {};
                    if (tradeResult.bidState !== 'highest') {
                      // TODO: do something about this
                      console.warn(`Something happened when trying to bid on ${tradeResult.tradeId}`);
                    }
                  }
                }
              }
            }
          }
        }


        // buy now goes directly to unassigned now
        if (binWon) {
          await dispatch(getUnassigned(state.account.email));
          state = getState();
          for (const i of state.bid.unassigned) {
            const baseId = Fut.getBaseId(i.resourceId);
            const trackedPlayer = _.get(state.player, `list.${baseId}`, false);
            if (trackedPlayer) {
              // Send it to the tradepile
              const pileResponse = await api.sendToTradepile(i.id);
              if (pileResponse.itemData[0].success) {
                await api.listItem(
                  i.id,
                  trackedPlayer.price.sell,
                  trackedPlayer.price.bin,
                  3600);
                listed[baseId] += 1;
              }
            }
          }
        }

        // Relist expired trades (and list new ones if needed)
        const expired = state.bid.tradepile.filter(i => i.tradeState === 'expired' || i.itemData.itemState === 'free');
        if (expired.length > 0) {
          console.log('Re-listing expired items');
          let relistFailed = false;
          if (settings.relistAll) {
            const relist = await api.relist();
            if (relist.code === 500) {
              relistFailed = true;
            }
          }
          // Relist all failed? Do it manually.
          if (!settings.relistAll || relistFailed) {
            console.log(`Manually re-listing ${expired.length} players.`);
            for (const i of expired) {
              const baseId = Fut.getBaseId(i.itemData.resourceId);
              const priceDetails = _.get(state.player, `list.${baseId}.price`, false);
              if (!settings.relistAll && priceDetails) {
                await api.listItem(i.itemData.id, priceDetails.sell, priceDetails.bin, 3600);
              } else {
                await api.listItem(i.itemData.id, i.startingBid, i.buyNowPrice, 3600);
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
              dispatch(updateHistory(baseId, i));
            }
            await api.removeFromTradepile(i.tradeId);
          }
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

export function updateHistory(id, trade) {
  return { type: types.UPDATE_PLAYER_HISTORY, id, trade };
}

export function stop() {
  return { type: types.STOP_BIDDING };
}
