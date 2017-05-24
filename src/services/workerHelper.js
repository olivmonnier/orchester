import requestDb from './requestDb';

export default function (basename) {
  const builder = (params) => {
    return requestDb(Object.assign({ basename }, params))
  }

  return {
    get(params) {
      const { table, search } = params;

      return builder({
        request: 'get',
        table,
        search
      })
    },
    getAll(params) {
      const { table } = params;

      return builder({
        request: 'getAll',
        table
      })
    },
    save(params) {
      const { table, data } = params;

      return builder({
        request: 'save',
        table,
        data
      })
    },
    'delete'(params) {
      const { table, id } = params;

      return builder({
        request: 'delete',
        table,
        id
      })
    },
    deleteAll(params) {
      const { table } = params;

      return builder({
        request: 'deleteAll',
        table
      })
    }
  }
}
