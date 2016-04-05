require.main.paths.splice(0, 0, process.env.NODE_PATH);

import electron from 'electron';
const remote = electron.remote;
const Menu = remote.Menu;

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import template from './menutemplate';
import webUtil from './utils/WebUtil';
import metrics from './utils/MetricsUtil';

webUtil.addWindowSizeSaving();
webUtil.addLiveReload();
webUtil.disableGlobalBackspace();

Menu.setApplicationMenu(Menu.buildFromTemplate(template()));

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
  document.getElementById('app')
);
