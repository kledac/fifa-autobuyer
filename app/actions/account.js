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
