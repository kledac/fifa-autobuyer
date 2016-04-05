import electron from 'electron';
const remote = electron.remote;
import util from './utils/Util';
import metrics from './utils/MetricsUtil';
import shell from 'shell';
import { hashHistory } from 'react-router';

const app = remote.app;

// main.js
export default function () {
  return [
    {
      label: 'FIFA Autobuyer',
      submenu: [
        {
          label: 'About FIFA Autobuyer',
          click() {
            metrics.track('Opened About', {
              from: 'menu'
            });
            hashHistory.push('/about');
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Preferences',
          accelerator: `${util.commandOrCtrl()}+,`,
          click() {
            metrics.track('Opened Preferences', {
              from: 'menu'
            });
            hashHistory.push('/preferences');
          },
        },
        {
          type: 'separator',
        },
        {
          type: 'separator',
        },
        {
          label: 'Hide FIFA Autobuyer',
          accelerator: `${util.commandOrCtrl()}+H`,
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: `${util.commandOrCtrl()}+Shift+H`,
          selector: 'hideOtherApplications:',
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: `${util.commandOrCtrl()}+Q`,
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: `${util.commandOrCtrl()}+Z`,
          selector: 'undo:',
        },
        {
          label: 'Redo',
          accelerator: `Shift+${util.commandOrCtrl()}+Z`,
          selector: 'redo:',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: `${util.commandOrCtrl()}+X`,
          selector: 'cut:',
        },
        {
          label: 'Copy',
          accelerator: `${util.commandOrCtrl()}+C`,
          selector: 'copy:',
        },
        {
          label: 'Paste',
          accelerator: `${util.commandOrCtrl()}+V`,
          selector: 'paste:',
        },
        {
          label: 'Select All',
          accelerator: `${util.commandOrCtrl()}+A`,
          selector: 'selectAll:',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Chromium Developer Tools',
          accelerator: 'Alt+' + `${util.commandOrCtrl()}+I`,
          click() {
            remote.getCurrentWindow().toggleDevTools();
          },
        },
      ],
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: `${util.commandOrCtrl()}+M`,
          selector: 'performMiniaturize:',
        },
        {
          label: 'Close',
          accelerator: `${util.commandOrCtrl()}+W`,
          click() {
            remote.getCurrentWindow().hide();
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:',
        },
        {
          type: 'separator',
        },
        {
          label: 'FIFA Autobuyer',
          accelerator: `${util.commandOrCtrl()}+0`,
          click() {
            remote.getCurrentWindow().show();
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Report Issue or Suggest Feedback',
          click() {
            metrics.track('Opened Issue Reporter', {
              from: 'menu'
            });
            shell.openExternal('https://github.com/hunterjm/fifa-autobuyer/issues/new');
          },
        },
      ],
    },
  ];
}
