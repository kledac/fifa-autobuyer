import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Login from './components/Login';
import Players from './components/Players';
import PlayerSearch from './components/PlayerSearch';
import PlayerDetails from './components/PlayerDetails';
// import Bidder from './components/Bidder';
// import Bid from './components/Bid';
// import Preferences from './components/Preferences';
// import Loading from './components/Loading';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Login} />
    <Route path="players" component={Players}>
      <IndexRoute component={PlayerSearch} />
      <Route path=":id" component={PlayerDetails} />
    </Route>
  </Route>
);

// <Route path="/player" handler={Player}>
//   <Route path="/details/:id" handler={PlayerDetails} />
//   <Route path="/search" handler={PlayerSearch} />
// </Route>
// <Route path="/bidder" handler={Bidder}>
//   <Route path="/bid" handler={Bid} />
//   <Route path="/preferences" handler={Preferences} />
// </Route>
// <Route name="loading" handler={Loading} />
