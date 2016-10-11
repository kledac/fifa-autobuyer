import { push } from 'react-router-redux';
import * as types from './accountTypes';
import { init, getApi } from '../utils/ApiUtil';
import metrics from '../utils/MetricsUtil';

export function setAccountInfo(key, value) {
  return { type: types.SET_ACCOUNT_INFO, key, value };
}

export function setCredits(credits) {
  return { type: types.SET_CREDITS, credits };
}

export function getCredits(email) {
  return async dispatch => {
    const api = getApi(email);
    if (api) {
      const result = await api.getCredits();
      dispatch(setCredits(result.credits));
    }
  };
}

export function login(account, tfCb = () => {}, captchaCb = () => {}) {
  return async dispatch => {
    try {
      const apiClient = init(account, tfCb, captchaCb);
      await apiClient.login();
      metrics.track('Successful Login');
      dispatch(getCredits(account.email));
      dispatch(push('/players'));
    } catch (e) {
      // this.setState({ twoFactor: false, loading: false, errors: { detail: e.message } });
      throw e;
    }
  };
}
