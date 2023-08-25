import { AppError } from '../tracker/tracking-event.model';
import { ERROR_STORE, openDB } from '../util/db';

/** Add errors to the database */
export function addError(error: AppError) {
  return new Promise((resolve, reject) => {
    openDB({
      onSuccess: (db) => {
        const tx = db.transaction(ERROR_STORE, 'readwrite');
        tx.addEventListener('complete', () => {
          console.log('✅ Insertion completed', error);
          // delay(5000).then(() => resolve(true));
          resolve(true);
          db.close();
        });
        const store = tx.objectStore(ERROR_STORE);

        const request = store.put(error);
        request.onerror = () => {
          console.error('❌ Insertion failed', error, request.error);
        };
        request.onsuccess = () => {
          console.log('Insertion started...', error);
        };
      },
      onError: (err) => reject(err),
    });
  });
}

/** Read existing errors from the browser database */
export function readErrors(): Promise<AppError[]> {
  return new Promise((resolve, reject) => {
    openDB({
      onSuccess: (db) => {
        const request = db.transaction(ERROR_STORE, 'readonly').objectStore(ERROR_STORE).getAll();
        request.onerror = () => {
          reject(request.error);
        };
        request.onsuccess = () => {
          resolve(request.result as AppError[]);
        };
      },
      onError: (err) => reject(err),
    });
  });
}

/** Remove all existing errors from the browser database */
export function clearErrors(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    openDB({
      onSuccess: (db) => {
        const tx = db.transaction(ERROR_STORE, 'readwrite');
        const store = tx.objectStore(ERROR_STORE);

        store.clear();

        tx.onerror = (err) => {
          reject(err);
        };
        tx.oncomplete = () => {
          console.log('🗑️ Removal of errors completed');
          resolve(true);
        };
      },
      onError: (err) => reject(err),
    });
  });
}
