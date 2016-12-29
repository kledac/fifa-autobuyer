import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import ConnectedAccount from './containers/Account';
import ConnectedPlayers from './containers/Players';
import ConnectedPlayerSearch from './components/player/PlayerSearch';
import ConnectedPlayerDetails from './components/player/PlayerDetails';
import ConnectedBidOverview from './components/bid/Overview';
import ConnectedSettings from './components/Settings';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={ConnectedAccount} />
    <Route path="players" component={ConnectedPlayers}>
      <IndexRoute component={ConnectedPlayerSearch} />
      <Route path="overview" component={ConnectedBidOverview} />
      <Route path=":id" component={ConnectedPlayerDetails} />
    </Route>
    <Route path="settings" component={ConnectedPlayers}>
      <IndexRoute component={ConnectedSettings} />
    </Route>
  </Route>
);
