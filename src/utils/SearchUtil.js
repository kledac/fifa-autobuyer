import request from 'request';
import { saveResults } from '../actions/players';
import fs from 'fs';
import path from 'path';
import metrics from '../utils/MetricsUtil';
import electron from 'electron';
const remote = electron.remote;
const app = remote.app;

const ENDPOINT = 'https://www.easports.com/uk/fifa/ultimate-team/api';
let searchReq = null;

export default {
  search(query, page, dispatch) {
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
        const data = JSON.parse(body);
        if (response.statusCode === 200) {
          metrics.track('Player Search', {
            query,
            results: data.totalResults
          });
          dispatch(saveResults(data));
        }
      }
    );
  },
  loadPlayerList() {
    let list = [];
    try {
      list = JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), 'players')));
    } catch (err) {
      // continue regardless of error
    }
    return list;
  },
  savePlayerList(playerList) {
    fs.writeFileSync(path.join(app.getPath('userData'), 'players'), JSON.stringify(playerList));
  }
};
