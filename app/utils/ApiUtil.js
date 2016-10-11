import Fut from 'fut';
import _ from 'lodash';

const logins = [];

export function init(account, tfAuthHandler, captchaHandler, rpm = 15) {
  if (process.env.NODE_ENV === 'test') {
    // Tests are mocked, so no need to limit
    rpm = 0; // eslint-disable-line no-param-reassign
  }
  let login = _.find(logins, { email: account.email });
  if (login === undefined) {
    const api = new Fut({
      ...account,
      RPM: rpm,
      minDelay: rpm && (60 / rpm) * 1000,
      captchaHandler,
      tfAuthHandler,
      saveVariable: (key, val) => {
        const apiVars = JSON.parse(window.localStorage.getItem(`${account.email}::apiVars`)) || {};
        _.set(apiVars, key, val);
        window.localStorage.setItem(`${account.email}::apiVars`, JSON.stringify(apiVars));
      },
      loadVariable: key => {
        const apiVars = JSON.parse(window.localStorage.getItem(`${account.email}::apiVars`)) || {};
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
