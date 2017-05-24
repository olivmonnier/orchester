export default function(worker) {
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
        if (!data['id']) {
          adapters[adapter].get.call(self, result);
        }
      });
    },
    remove(id) {
      worker.get({ table: 'Resources', search: { repositoryId: id } }).then((resources) => {
        resources.forEach((resource) => {
          worker.delete({ table: 'Resources', id: resource.id })
        })
      });
      return worker.delete({ table: 'Repository', id });
    },
    getResources(id) {
      return this.resources.get({ repositoryId: id })
    }
  }
}
