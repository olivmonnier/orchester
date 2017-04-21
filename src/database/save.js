import get from './get';
import getObjectStore from './getObjectStore';

export default function (table, db, data) {
  return new Promise((resolve, reject) => {
    const store = getObjectStore(table, db, 'readwrite');
    const request = data.id
       ? store.put(data)
       : store.add(data);

    request.onerror = reject;
    request.onsuccess = (e) => resolve(e.target.result);
  })
}
