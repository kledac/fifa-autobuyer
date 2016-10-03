export const SAVE_ACCOUNT = 'SAVE_ACCOUNT';
export const SET_CREDITS = 'SET_CREDITS';

export function saveAccount(account) {
  return { type: SAVE_ACCOUNT, account };
}

export function setCredits(credits) {
  return { type: SET_CREDITS, credits };
}
