import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Login from './components/Login';
import About from './components/About';
import Players from './components/Players';
import PlayerSearch from './components/PlayerSearch';
import PlayerDetails from './components/PlayerDetails';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Login} />
    <Route path="about" component={About} />
    <Route path="players" component={Players}>
      <IndexRoute component={PlayerSearch} />
      <Route path=":id" component={PlayerDetails} />
    </Route>
  </Route>
);
