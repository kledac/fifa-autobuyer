import Fut from 'fut';
import _ from 'lodash';

const logins = [];

export function init(account, tfAuthHandler, captchaHandler) {
  let login = _.find(logins, { email: account.email });
  if (login === undefined) {
    const api = new Fut({
      ...account,
      captchaHandler,
      tfAuthHandler,
      saveVariable: (key, val) => {
        const apiVars = JSON.parse(localStorage.getItem(`${account.email}::apiVars`)) || {};
        _.set(apiVars, key, val);
        localStorage.setItem(`${account.email}::apiVars`, JSON.stringify(apiVars));
      },
      loadVariable: key => {
        const apiVars = JSON.parse(localStorage.getItem(`${account.email}::apiVars`)) || {};
        return _.get(apiVars, key, false);
      }
    });
    login = { email: account.email, api };
    logins.push(login);
  }
  return login.api;
}

export function getApi(email) {
  const login = _.find(logins, { email });
  return login && login.api;
}
