import getObjectStore from './getObjectStore';

export default function (table, db, search) {
  let data = [], key, value, request;

  if (typeof search === 'number') {
    key = 'id';
    value = search;
  } else {
    key = Object.keys(search)[0];
    value = search[key];
  }

  return new Promise((resolve, reject) => {
    const store = getObjectStore(table, db);

    if (key === 'id') {
      request = store.get(value);
    } else {
      const indexRepos = store.index(key);
      request = indexRepos.openCursor(value);
    }

    request.onerror = reject;
    request.onsuccess = (e) => {
      let result = e.target.result;

      if (key === 'id') return resolve(result);

      if (result && result !== null) {
        data.push(result.value);
        result.continue();
      } else {
        resolve(data);
      }
    }
  })
}
