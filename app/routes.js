import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import ConnectedAccount from './containers/Account';
import About from './containers/About';
import Players from './containers/Players';
import PlayerSearch from './components/player/PlayerSearch';
import PlayerDetails from './components/player/PlayerDetails';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={ConnectedAccount} />
    <Route path="about" component={About} />
    <Route path="players" component={Players}>
      <IndexRoute component={PlayerSearch} />
      <Route path=":id" component={PlayerDetails} />
    </Route>
  </Route>
);
