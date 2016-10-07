import { remote } from 'electron';
import localforage from 'localforage';
import Fut from 'fut';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const logins = [];
const playerList = [];
let bidId;

export function init(account, tfAuthHandler, captchaHandler) {
  let login = _.find(logins, { email: account.email });
  if (login === undefined) {
    const db = localforage.createInstance({
      name: account.email
    });
    const api = new Fut({
      ...account,
      captchaHandler,
      tfAuthHandler,
      // yo can return a simple sync function to save/loadVariable
      saveVariable: (key, val) => {
        db.setItem(key, val);
      },
      loadVariable: key => db.getItem(key)
    });
    login = { email: account.email, db, api };
    logins.push(login);
  }
  return login.api;
}

export function getApi(email) {
  const login = _.find(logins, { email });
  return login && login.api;
}

export function loadAccount() {
  let accountInfo = {
    email: '',
    password: '',
    secret: '',
    platform: ''
  };
  try {
    accountInfo = JSON.parse(fs.readFileSync(path.join(remote.app.getPath('userData'), 'account')));
  } catch (err) {
    // continue regardless of error
  }
  return accountInfo;
}

export function saveAccount(account) {
  fs.writeFileSync(path.join(remote.app.getPath('userData'), 'account'), JSON.stringify(account));
}

export default {
  saveAccount(account) {
    fs.writeFileSync(path.join(remote.app.getPath('userData'), 'account'), JSON.stringify(account));
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
