export default function(instance, worker) {
  const { adapters } = instance;

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

        if (ad && ad.hasOwnProperty('post')) {
          ad.post('repository', result);
        }
        if (!data['id']) {
          ad.get.call(self, result);
        }
        return result;
      });
    },
    remove(id) {
      worker.get({ table: 'Resources', search: { repositoryId: id } }).then((res) => {
        res.forEach((resource) => worker.delete({ table: 'Resources', id: resource.id }))
      });

      return instance.repositories.get(id).then((repository) => {
        const { adapter } = repository;

        worker.delete({ table: 'Repositories', id }).then(() => {
          const ad = adapters[adapter]
          if (ad && ad.hasOwnProperty('remove')) {
            ad.remove('repository', repository)
          }
        })

        return repository;
      })
    },
    getResources(id) {
      return instance.resources.get({ repositoryId: id })
    }
  }
}
