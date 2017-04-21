import get from './get';
import getAll from './getAll';
import save from './save';
import _delete from './delete';
import deleteAll from './deleteAll';

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

export default function (basename) {
  if (!indexedDB) {
    return new Error('Your browser doesn\'t support IndexedDB')
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(basename, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      const reposStore = db.createObjectStore('Repositories', { keyPath: 'id', autoIncrement: true })
      reposStore.createIndex('name', 'name', { unique: false });
      reposStore.createIndex('synced', 'synced', { unique: false });

      const resourcesStore = db.createObjectStore('Resources', { keyPath: 'id', autoIncrement: true });
      resourcesStore.createIndex('name', 'name', { unique: false });
      resourcesStore.createIndex('repositoryId', 'repositoryId', { unique: false });
    }

    request.onerror = reject;
    request.onsuccess = (event) => {
      const db = event.target.result;

      resolve({
        db,
        repositories: getMethodsTable('Repositories', db),
        resources: getMethodsTable('Resources', db)
      })
    }
  })
}

function getMethodsTable(table, db) {
  return {
    save(args) {
      return save(table, db, args)
    },
    get(name) {
      return get(table, db, name)
    },
    getAll() {
      return getAll(table, db)
    },
    'delete'(id) {
      return _delete(table, db, id)
    },
    deleteAll() {
      return deleteAll(table, db)
    }
  }
}
