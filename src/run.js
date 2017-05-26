import isOnline from './services/isOnline';
import workerHelper from './services/workerHelper';
import { sync, stopSync } from './sync';
import apiRepositories from './api/repositories';
import apiResources from './api/resources';

export default function(params) {
  const { basename } = params;

  const _worker = workerHelper(basename);

  if (isOnline()) sync(params, _worker);

  if (typeof window.addEventListener === "function") {
    window.addEventListener('online', () => sync(params));
    window.addEventListener('offline', () => stopSync());
  }

  return Object.assign(params, {
    repositories: apiRepositories(params, _worker),
    resources: apiResources(params, _worker)
  })
}
