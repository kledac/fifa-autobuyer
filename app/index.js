import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import webUtil from './utils/WebUtil';
import metrics from './utils/MetricsUtil';

webUtil.addWindowSizeSaving();
webUtil.disableGlobalBackspace();

metrics.track('Started App');
metrics.track('app heartbeat');
setInterval(() => {
  metrics.track('app heartbeat');
}, 14400000);

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
