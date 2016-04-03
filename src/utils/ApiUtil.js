import FutApi from 'fut-api';
import path from 'path';
import electron from 'electron';
const remote = electron.remote;
const app = remote.app;

const apiClient = {};

export default function getApi(username) {
  if (apiClient[username] === undefined) {
    apiClient[username] = new FutApi({
      saveCookie: true,
      saveCookiePath: path.join(app.getPath('userData'), username),
      loadCookieFromSavePath: true
    });
  }
  return apiClient[username];
}
