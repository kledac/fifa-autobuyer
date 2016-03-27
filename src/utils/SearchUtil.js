import request from 'request';
import { saveResults } from '../actions/players';

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
          dispatch(saveResults(data));
        }
      }
    );
  }
};
