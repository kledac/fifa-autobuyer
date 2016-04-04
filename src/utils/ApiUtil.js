import 'babel-polyfill';
import FutApi from 'fut-api';
import fs from 'fs';
import path from 'path';
import electron from 'electron';
import Promise from 'bluebird';
const remote = electron.remote;
const app = remote.app;

const apiClient = {};
let lastUsername;

export default {
  getApi(username) {
    if (apiClient[username] === undefined) {
      const api = new FutApi({
        saveCookie: true,
        saveCookiePath: path.join(app.getPath('userData'), username),
        loadCookieFromSavePath: true
      });
      apiClient[username] = Promise.promisifyAll(api);
    }
    lastUsername = username;
    return apiClient[username];
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
  findPrice: async function findPrice(id, buy = 0, num = 0) {
    const api = apiClient[lastUsername];
    const filter = { definitionId: id, num: 50 };
    if (buy) {
      filter.maxb = buy;
    }
    let lowest = buy;
    let total = num;
    const response = await api.searchAsync(filter);
    const prices = response.auctionInfo.map((i) => i.buyNowPrice);
    if (prices.length) {
      lowest = Math.min(...prices);
      prices.filter((i) => i.buyNowPrice === lowest);
      total = prices.length;
      // If we have 50 of the same result, go one lower
      if (total === 50) {
        lowest = FutApi.calculateNextLowerPrice(lowest);
      }
    }
    if (buy === 0 || lowest < buy) {
      return findPrice(id, lowest, total);
    }
    return { lowest, total };
  }
};
