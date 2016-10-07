import _ from 'lodash';
import { push } from 'react-router-redux';
import { init, getApi } from '../utils/ApiUtil';
import metrics from '../utils/MetricsUtil';

export const SET_ACCOUNT_INFO = 'account/set/info';
export const SAVE_ACCOUNT = 'account/save';
export const SET_CREDITS = 'account/set/credits';

export function setAccountInfo(key, value) {
  return { type: SET_ACCOUNT_INFO, key, value };
}

export function saveAccount(account) {
  return { type: SAVE_ACCOUNT, account };
}

export function setCredits(credits) {
  return { type: SET_CREDITS, credits };
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
      // TODO: save this in localStorage or somewhere using getState()
      dispatch(saveAccount(_.omit(account, ['code'])));
      dispatch(getCredits(account.email));
      dispatch(push('/players'));
    } catch (e) {
      this.setState({ twoFactor: false, loading: false, errors: { detail: e.message } });
      throw e;
    }
  };
}
