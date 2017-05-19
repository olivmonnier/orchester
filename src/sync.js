import workerHelper from './services/workerHelper';

let runnerSync;

export const sync = function(runner) {
  let runners;
  const { adapters, basename, interval, workerPath } = runner;

  const _worker = workerHelper(workerPath, basename);

  runnerSync = setInterval(() => {
    runners = [];

    _worker.get({ table: 'Repositories', search: {synced: 'true'} }).then((repositories) => {
      repositories.forEach((repo) => {
        runners.push(adapters[repo.adapter].get.call(runner, repo.id))
      })
      Promise.all(runners)
    })
  }, interval || 5000)
}

export const stopSync = function() {
  clearInterval(runnerSync);
}
