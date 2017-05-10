import workerHelper from './services/workerHelper';

let runnerSync;

export const sync = function(runner) {
  let runners;
  const { adapters, basename, interval, workerPath } = runner;
  const _worker = workerHelper(workerPath, basename);

  runnerSync = setInterval(() => {
    const startEventSync = new CustomEvent('startsync', runner);
    const endEventSync = new CustomEvent('endsync', runner);

    runners = [];
    document.dispatchEvent(startEventSync);

    _worker.get({ table: 'Repositories', search: {synced: 'true'} }).then((repositories) => {
      repositories.forEach((repo) => {
        runners.push(adapters[repo.adapter].get.call(runner, repo.id))
      })
      Promise.all(runners).then(() => document.dispatchEvent(endEventSync))
    })
  }, interval)
}

export const stopSync = function() {
  clearInterval(runnerSync);
}
