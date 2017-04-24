import isOnline from './services/isOnline';
import workerHelper from './services/workerHelper';

let runnerSync;
let _worker;

class Orchester {

  constructor(params) {
    const { basename, adapters, interval, workerPath } = params;

    _worker = workerHelper(workerPath, basename);

    this.adapters = adapters;
    this.interval = interval || 5000;
    this.isOnline = isOnline();

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
  addRepository(adapter, name, synced = false) {
    synced = (synced) ? 'true' : 'false';

    _worker.save({ table: 'Repositories', data: { name, adapter, synced } }).then((result) => {
      const addEventRepo = new CustomEvent('newrepository', result);

      this.adapters[adapter].get.call(this, result);
      document.dispatchEvent(addEventRepo);
    });
  }
  removeRepository(id) {
    _worker.get({ table: 'Resources', search: { repositoryId: id } }).then((resources) => {
      resources.forEach((resource) => {
        _worker.delete({ table: 'Resources', id: resource.id })
      })
    });
    _worker.delete({ table: 'Repository', id }).then((result) => {
      const deleteEventRepo = new CustomEvent('deleterepository', result);

      document.dispatchEvent(deleteEventRepo);
    });
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

window.Orchester = Orchester;
