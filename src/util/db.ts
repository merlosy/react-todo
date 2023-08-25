const DB_NAME = 'ToDoList';
const DB_VERSION = 1;
export const TODO_STORE = 'todos';
export const ERROR_STORE = 'errors';

type DBCallbacks = {
  onSuccess: (db: IDBDatabase) => void;
  onError: (err?: DOMException | null) => void;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Open connection to the database and run migrations when needed */
export function openDB({ onSuccess, onError }: DBCallbacks): IDBOpenDBRequest {
  const namedDb = window.indexedDB.open(DB_NAME, DB_VERSION);
  namedDb.addEventListener('error', () => {
    // console.error('> DB error');
    onError(namedDb.error);
  });
  namedDb.addEventListener('upgradeneeded', (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    db.onclose = () => console.log('> DB closed');
    if (!db.objectStoreNames.contains(TODO_STORE)) {
      const store = db.createObjectStore(TODO_STORE, { keyPath: 'id' });
      store.createIndex('by_id', 'id', { unique: true });
      store.createIndex('by_text', 'text', { unique: false });
      store.createIndex('by_description', 'description');
    }
    if (!db.objectStoreNames.contains(ERROR_STORE)) {
      db.createObjectStore(ERROR_STORE, { autoIncrement: true });
    }
    // console.log('> DB upgraded', db.objectStoreNames);
  });
  namedDb.addEventListener('blocked', () => {
    console.error('💀 DB blocked');
  });
  namedDb.addEventListener('success', (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    // console.log('> DB open');
    onSuccess(db);
  });
  return namedDb;
}
