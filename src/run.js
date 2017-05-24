import isOnline from './services/isOnline';
import workerHelper from './services/workerHelper';
import { sync, stopSync } from './sync';
import apiRepositories from './api/repositories';
import apiResources from './api/resources';

export default function(params) {
  const { basename, adapters, interval } = params;
  const self = this;

  const _worker = workerHelper(basename, adapters);

  if (isOnline()) sync(params);

  if (typeof window.addEventListener === "function") {
    window.addEventListener('online', () => sync(params));
    window.addEventListener('offline', () => stopSync());
  }

  return Object.assign(params, {
    repositories: apiRepositories(_worker),
    resources: apiResources(_worker)
  })
}
