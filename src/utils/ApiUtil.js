import FutApi from 'fut-api';
import fs from 'fs';
import path from 'path';
import electron from 'electron';
const remote = electron.remote;
const app = remote.app;

const apiClient = {};

export default {
  getApi(username) {
    if (apiClient[username] === undefined) {
      apiClient[username] = new FutApi({
        saveCookie: true,
        saveCookiePath: path.join(app.getPath('userData'), username),
        loadCookieFromSavePath: true
      });
    }
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
  }
};
