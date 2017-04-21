import getObjectStore from './getObjectStore';

export default function (table, db) {
  return new Promise((resolve, reject) => {
    let data = [];
    const store = getObjectStore(table, db);
    const cursor = store.openCursor();

    cursor.onerror = reject;
    cursor.onsuccess = (e) => {
      let result = e.target.result;

      if (result && result !== null) {
        data.push(result.value);
        result.continue();
      } else {
        resolve(data);
      }
    }
  })
}
