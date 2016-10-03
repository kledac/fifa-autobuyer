import Fut from 'fut';
import fs from 'fs';
import path from 'path';
import electron from 'electron';
import Promise from 'bluebird';
import _ from 'lodash';

const remote = electron.remote;
const app = remote.app;

const accounts = [];
let playerList = [];
let bidId;

export default {
  getApi(username) {
    let account = _.find(accounts, { username });
    if (account === undefined) {
      const api = new Fut({
        saveCookie: true,
        saveCookiePath: path.join(app.getPath('userData'), username),
        loadCookieFromSavePath: true
      });
      account = { username, api: Promise.promisifyAll(api) };
      accounts.push(account);
    }
    return account.api;
  },
  loadAccount() {
    let accountInfo = {
      username: '',
      password: '',
      secret: '',
      platform: ''
    };
    try {
      accountInfo = JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), 'account')));
    } catch (err) {
      // continue regardless of error
    }
    return accountInfo;
  },
  saveAccount(account) {
    fs.writeFileSync(path.join(app.getPath('userData'), 'account'), JSON.stringify(account));
  },
  subscribe(state) {
    playerList = state.playerList;
  },
  findPrice: async function findPrice(id, buy = 0, num = 0) {
    // Exit if we don't have a connection
    if (!accounts.length) {
      return;
    }
    const api = accounts[0].api;
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
      return findPrice(id, lowest, total);
    }
    return { lowest, total };
  },
  bid() {
    let bidding = false;
    let pileFull = false;
    const pileSize = 1;
    let watchlist = [];
    if (bidId === undefined) {
      bidId = setInterval(async () => {
        if (bidding || !playerList.length || !accounts.length) {
          return;
        }
        bidding = true;
        const api = accounts[0].api;
        // Update watchlist
        watchlist = await api.getTradepile();
        // console.log(watchlist);
        if (pileFull && watchlist.auctionInfo.length < pileSize) {
          pileFull = false;
        }
        // console.log(Math.floor(playerList.length / accounts.length));
        bidding = false;
      }, 1000);
    } else {
      clearInterval(bidId);
      bidId = undefined;
    }
  }
};
