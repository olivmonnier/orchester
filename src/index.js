import run from './run';
import { sync, stopSync } from './sync';
import isOnline from './services/isOnline';

const Orchester = {
  run,
  sync,
  stopSync,
  isOnline
}

if (window) {
  window.Orchester = Orchester;
}

module.exports = Orchester;
