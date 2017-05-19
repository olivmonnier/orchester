import workerHelper from './services/workerHelper';

let runnerSync;

export const sync = function(runner) {
  let runners;
  const { adapters, basename, interval } = runner;

  const _worker = workerHelper(basename);

  runnerSync = setInterval(() => {
    runners = [];

    _worker.get({ table: 'Repositories', search: {synced: 'true'} }).then((repositories) => {
      if(repositories.length > 0) {        
        repositories.forEach((repo) => {
          runners.push(adapters[repo.adapter].get.call(runner, repo))
        })
        Promise.all(runners)
      }
    })
  }, interval || 5000)
}

export const stopSync = function() {
  clearInterval(runnerSync);
}
