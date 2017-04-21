import openDatabase from './database/open';
import isOnline from './services/isOnline';

let runnerSync;

class Orchester {
  constructor(params) {
    const { basename, adapters, interval } = params;

    this.adapters = adapters;
    this.db = openDatabase(basename);
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

    this.db.then((db) => {
      db.repositories.save({ name, adapter, synced }).then((result) => {
        const addEventRepo = new CustomEvent('newrepository', result);

        this.adapters[adapter].get.call(this, result);
        document.dispatchEvent(addEventRepo);
      })
    })
  }
  removeRepository(id) {
    this.db.then((db) => {
      db.resources.get({ repositoryId: id }).then((resources) => {
        resources.forEach((resource) => {
          db.resources.delete(resource.id)
        })
      });
      db.repositories.delete(id).then((result) => {
        const deleteEventRepo = new CustomEvent('deleterepository', result);

        document.dispatchEvent(deleteEventRepo);
      });
    })
  }
  sync() {
    runnerSync = setInterval(() => {
      let runners = [];
      const startEventSync = new CustomEvent('startsync', this);
      const endEventSync = new CustomEvent('endsync', this);

      document.dispatchEvent(startEventSync);

      this.db.then((db) => {
        db.repositories.get({synced: 'true'}).then((repositories) => {
          repositories.forEach((repo) => {
            runners.push(this.adapters[repo.adapter].get.call(this, repo.id))
          })
          Promise.all(runners).then(() => document.dispatchEvent(endEventSync))
        })
      })
    }, this.interval)
  }
  stopSync() {
    clearInterval(runnerSync);
  }
}

window.Orchester = Orchester;
