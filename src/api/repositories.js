export default function(adapters, worker) {
  return {
    get(search) {
      return worker.get({ table: 'Repositories', search })
    },
    put(data) {
      const { adapter, name } = data;

      if (adapter === undefined || name === undefined) {
        return console.error(new Error('A repository must be have a name & adapter value'));
      }
      data['synced'] = (data['synced']) ? 'true' : 'false';

      return worker.save({ table: 'Repositories', data }).then((result) => {
        const ad = adapters[adapter];

        if (ad.hasOwnProperty('post')) {
          ad.post('repository', result);
        }
        if (!data['id']) {
          ad.get.call(self, result);
        }
        return result;
      });
    },
    remove(id) {
      const self = this;

      worker.get({ table: 'Resources', search: { repositoryId: id } }).then((resources) => {
        resources.forEach((resource) => self.resources.remove(resource.id))
      });
      return worker.delete({ table: 'Repository', id }).then((result) => {
        const repository = self.repositories.get(result);

        repository.then((repo) => {
          const { adapter } = repo;

          if (adapter.hasOwnProperty('remove')) {
            adapter.remove('repository', repo)
          }
        })
        return result;
      });
    },
    getResources(id) {
      return this.resources.get({ repositoryId: id })
    }
  }
}
