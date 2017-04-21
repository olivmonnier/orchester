import getObjectStore from './getObjectStore';

export default function (table, db, id) {
  return new Promise((resolve, reject) => {
    const store = getObjectStore(table, db, 'readwrite');
    const request = store.delete(id);

    request.onerror = reject;
    request.onsuccess = resolve;
  })
}
