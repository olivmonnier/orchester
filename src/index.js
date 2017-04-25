import isOnline from './services/isOnline';
import workerHelper from './services/workerHelper';

let runnerSync;
let _worker;

export default class Orchester {
  constructor(params) {
    const { basename, adapters, interval, workerPath } = params;
    const self = this;

    if (!workerPath) {
      return new Error('You must declare a path for the worker');
    }

    _worker = workerHelper(workerPath, basename);

    this.adapters = adapters;
    this.interval = interval || 5000;
    this.isOnline = isOnline();

    this.repositories = {
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
    }

    this.resources = {
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

    if (this.isOnline) this.sync();

    if (typeof window.addEventListener === "function") {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.sync();
      })
      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.stopSync();
      })
    }
  }
  sync() {
    let runners;

    runnerSync = setInterval(() => {
      const startEventSync = new CustomEvent('startsync', this);
      const endEventSync = new CustomEvent('endsync', this);

      runners = [];
      document.dispatchEvent(startEventSync);

      _worker.get({ table: 'Repositories', search: {synced: 'true'} }).then((repositories) => {
        repositories.forEach((repo) => {
          runners.push(this.adapters[repo.adapter].get.call(this, repo.id))
        })
        Promise.all(runners).then(() => document.dispatchEvent(endEventSync))
      })
    }, this.interval)
  }
  stopSync() {
    clearInterval(runnerSync);
  }
}

if (window) {
  window.Orchester = Orchester;
}
