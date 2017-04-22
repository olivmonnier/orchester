import open from './database/open';
import get from './database/get';
import getAll from './database/getAll';
import save from './database/save';
import _delete from './database/delete';
import deleteAll from './database/deleteAll';

self.onmessage = function (event) {
  const params = JSON.parse(event.data);
  const { request, basename, table, search, data, id } = params;

  open(basename).then((database) => {
    switch(request) {
      case('get'): {
        get(table, database, search).then((result) => sendResult(result))
      };
      break;

      case('getAll'): {
        getAll(table, database).then((result) => sendResult(result))
      };
      break;

      case('save'): {
        save(table, database, data).then((result) => sendResult(result))
      };
      break;

      case('delete'): {
        _delete(table, database, id).then((result) => sendResult(result))
      };
      break;

      case('deleteAll'): {
        deleteAll(table, database).then((result) => sendResult(result))
      }
    }
  })
}

function sendResult(result) {
  self.postMessage(JSON.stringify(result));
  self.close();
}
