import getObjectStore from './getObjectStore';

export default function (table, db) {
  return new Promise((resolve, reject) => {
    const store = getObjectStore(table, db, 'readwrite');
    const request = store.clear();

    request.onerror = reject;
    request.onsuccess = resolve;
  })
}
