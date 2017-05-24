export default function(adapters, worker) {
  return {
    get(search) {
      return worker.get({ table: 'Resources', search })
    },
    put(data) {
      const { name, repositoryId } = data;

      if (name === undefined || repositoryId === undefined ) {
        return console.error(new Error('A resource must be have a name and a repository id'))
      }
      return worker.save({ table: 'Resources', data })
    },
    remove(id) {
      return worker.delete({ table: 'Resources', id })
    }
  }
}
