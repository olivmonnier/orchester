export default function (workerPath, basename) {

  const builder = (params) => {
    const worker = new Worker(workerPath);

    return new Promise((resolve, reject) => {
      worker.postMessage(JSON.stringify(Object.assign({ basename }, params)));
      worker.onerror = reject;
      worker.onmessage = (event) => {
        const result = JSON.parse(event.data);

        resolve(result);
        worker.terminate();
      }
    })
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
