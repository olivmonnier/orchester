export default function (basename) {
  if (!indexedDB) {
    return new Error('Your browser doesn\'t support IndexedDB')
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(basename, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      const reposStore = db.createObjectStore('Repositories', { keyPath: 'id', autoIncrement: true })
      reposStore.createIndex('name', 'name', { unique: true });
      reposStore.createIndex('synced', 'synced', { unique: false });

      const resourcesStore = db.createObjectStore('Resources', { keyPath: 'id', autoIncrement: true });
      resourcesStore.createIndex('name', 'name', { unique: false });
      resourcesStore.createIndex('repositoryId', 'repositoryId', { unique: false });
    }

    request.onerror = reject;
    request.onsuccess = (event) => {
      const db = event.target.result;

      resolve(db)
    }
  })
}
