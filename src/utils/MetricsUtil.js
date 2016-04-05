import assign from 'object-assign';
import Mixpanel from 'mixpanel';
import uuid from 'node-uuid';
import fs from 'fs';
import path from 'path';
import util from './Util';
import os from 'os';
import osxRelease from 'osx-release';

let settings;
try {
  settings = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'settings.json'), 'utf8'));
} catch (err) {
  settings = {};
}

let token = process.env.NODE_ENV === 'development' ? settings['mixpanel-dev'] : settings.mixpanel;
if (!token) {
  token = 'none';
}

const mixpanel = Mixpanel.init(token);

if (localStorage.getItem('metrics.enabled') === null) {
  localStorage.setItem('metrics.enabled', true);
}

export default {
  enabled() {
    return localStorage.getItem('metrics.enabled') === 'true';
  },
  setEnabled(enabled) {
    localStorage.setItem('metrics.enabled', !!enabled);
  },
  track(name, data) {
    if (!name) {
      return;
    }

    const payload = data || {};

    if (localStorage.getItem('metrics.enabled') !== 'true') {
      return;
    }

    let id = localStorage.getItem('metrics.id');
    if (!id) {
      id = uuid.v4();
      localStorage.setItem('metrics.id', id);
    }

    const osName = os.platform();
    const osVersion = util.isWindows() ? os.release() : osxRelease(os.release()).version;

    mixpanel.track(name, assign({
      distinct_id: id,
      version: util.packagejson().version,
      'Operating System': osName,
      'Operating System Version': osVersion,
      'Operating System Architecture': os.arch()
    }, payload));
  },

};
