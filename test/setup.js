import 'babel-polyfill';
import { jsdom } from 'jsdom';
import mockery from 'mockery';
import electron from './mocks/electron';

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
window.localStorage = window.sessionStorage = {
  getItem(key) {
    return this[key] || null;
  },
  setItem(key, value) {
    this[key] = JSON.stringify(value);
  },
  removeItem(key) {
    this[key] = undefined;
  },
};
window.setTimeout = callback => {
  callback();
  // return a random number between 111111 and 999999
  return Math.floor(Math.random() * ((999999 - 111111) + 1)) + 111111;
};
window.clearTimeout = () => {};

// Mock Electron
mockery.enable({ warnOnUnregistered: false });
mockery.registerMock('electron', electron);
