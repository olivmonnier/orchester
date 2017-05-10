import isOnline from './services/isOnline';
import workerHelper from './services/workerHelper';
import { sync, stopSync } from './sync';

export default function(params) {
  const { basename, adapters, interval, workerPath } = params;
  const self = this;

  if (!workerPath) {
    return new Error('You must declare a path for the worker');
  }

  const _worker = workerHelper(workerPath, basename);

  if (isOnline()) sync(this);

  if (typeof window.addEventListener === "function") {
    window.addEventListener('online', () => sync(this));
    window.addEventListener('offline', () => stopSync());
  }

  return {
    adapters,
    basename,
    interval: interval || 5000,
    workerPath,
    repositories: {
      get(search) {
        return _worker.get({ table: 'Repositories', search })
      },
      put(data) {
        const { adapter, name } = data;

        if (!adapter || !name) {
          return new Error('A repository must be have a name & adapter value');
        }
        data['synced'] = (data['synced']) ? 'true' : 'false';

        return _worker.save({ table: 'Repositories', data }).then((result) => {
          if (!data['id']) {
            self.adapters[adapter].get.call(self, result);
          }
        });
      },
      remove(id) {
        _worker.get({ table: 'Resources', search: { repositoryId: id } }).then((resources) => {
          resources.forEach((resource) => {
            _worker.delete({ table: 'Resources', id: resource.id })
          })
        });
        return _worker.delete({ table: 'Repository', id });
      },
      getResources(id) {
        return this.resources.get({ repositoryId: id })
      }
    },
    resources: {
      get(search) {
        return _worker.get({ table: 'Resources', search })
      },
      put(data) {
        const { name, repositoryId } = data;

        if (!name || !repositoryId ) {
          return new Error('A resource must be have a name and a repository id')
        }
        return _worker.save({ table: 'Resources', data })
      },
      remove(id) {
        return _worker.delete({ table: 'Resources', id })
      }
    }
  }
}
