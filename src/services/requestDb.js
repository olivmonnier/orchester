import open from '../database/open';
import get from '../database/get';
import getAll from '../database/getAll';
import save from '../database/save';
import _delete from '../database/delete';
import deleteAll from '../database/deleteAll';

export default function (params) {
  let db;
  const { request, basename, table, search, data, id } = params;

  return open(basename).then((database) => {
    db = database;

    switch(request) {
      case('get'): {
        return get(table, database, search)
      };
      break;

      case('getAll'): {
        return getAll(table, database)
      };
      break;

      case('save'): {
        return save(table, database, data).then((result) => {
          const buildData = Object.assign(data, {
            id: result
          })

          return buildData;
        })
      };
      break;

      case('delete'): {
        return _delete(table, database, id)
      };
      break;

      case('deleteAll'): {
        return deleteAll(table, database)
      }
    }
  }).then((result) => {
    db.close();
    return result;
  })
}
