import _ from 'lodash';

export default ({ getState }) => next => action => {
  // Call the action
  next(action);
  // Persist what we want into window.localStorage
  const state = getState();
  window.localStorage.setItem('state', JSON.stringify({
    account: {
      // login details
      ..._.pick(_.get(state, 'account', {}), ['email', 'password', 'secret', 'platform'])
    },
    players: {
      // player list
      list: _.merge({}, _.get(state, 'players.list', {}))
    }
  }));
};
