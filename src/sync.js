import workerHelper from './services/workerHelper';

let runnerSync;

export const sync = function(instance, worker) {
  let runners;
  const { adapters, interval } = instance;

  runnerSync = setInterval(() => {
    runners = [];

    worker.get({ table: 'Repositories', search: {synced: 'true'} }).then((repositories) => {
      if(repositories.length > 0) {
        repositories.forEach((repo) => {
          runners.push(adapters[repo.adapter].get.call(instance, repo))
        })
        Promise.all(runners)
      }
    })
  }, interval || 5000)
}

export const stopSync = function() {
  clearInterval(runnerSync);
}
