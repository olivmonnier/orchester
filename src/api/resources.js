export default function(instance, worker) {
  const { adapters } = instance;

  return {
    get(search) {
      return worker.get({ table: 'Resources', search })
    },
    put(data) {
      const { name, repositoryId } = data;

      if (name === undefined || repositoryId === undefined ) {
        return console.error(new Error('A resource must be have a name and a repository id'))
      }

      return worker.save({ table: 'Resources', data }).then((result) => {
        instance.repositories.get(repositoryId).then((repository) => {
          const { adapter } = repository;
          const ad = adapters[adapter];

          if (ad.hasOwnProperty('post')) {
            ad.post('resource', result);
          }
        })

        return result;
      })
    },
    remove(id) {
      return instance.resources.get(id).then((resource) => {
        const { repositoryId } = resource;

        instance.repositories.get(repositoryId).then((repository) => {
          const { adapter } = repository;
          const ad = adapters[adapter];

          worker.delete({ table: 'Resources', id }).then(() => {
            if (ad && ad.hasOwnProperty('remove')) {
              ad.remove('resource', resource);
            }
          })
        });

        return resource;
      })
    }
  }
}
