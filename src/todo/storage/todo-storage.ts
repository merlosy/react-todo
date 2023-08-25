import { TODO_STORE, openDB } from '../../util/db';
import { Todo } from '../todo.model';

type PersistedTodo = Omit<Todo, 'isSynced'>;

/** Add new todos to the database */
export function insertTodos(todos: PersistedTodo[]) {
  return new Promise((resolve, reject) => {
    openDB({
      onSuccess: (db) => {
        const tx = db.transaction(TODO_STORE, 'readwrite');
        tx.addEventListener('complete', () => {
          console.log('✅ Insertion completed', todos);
          // delay(5000).then(() => resolve(true));
          resolve(true);
          db.close();
        });
        const store = tx.objectStore(TODO_STORE);

        todos.forEach((todo) => {
          const request = store.put(todo);
          request.onerror = () => {
            console.error('❌ Insertion failed', todo, request.error);
          };
          request.onsuccess = () => {
            console.log('Insertion started...', todo);
          };
        });
      },
      onError: (err) => reject(err),
    });
  });
}

/** Read existing todos from the browser database */
export function readTodos(): Promise<Todo[]> {
  return new Promise((resolve, reject) => {
    openDB({
      onSuccess: (db) => {
        const request = db.transaction(TODO_STORE, 'readonly').objectStore(TODO_STORE).getAll();
        request.onerror = () => {
          reject(request.error);
        };
        request.onsuccess = () => {
          const todos = (request.result as PersistedTodo[]).map((todo) => ({
            ...todo,
            isSynced: true,
          }));
          resolve(todos);
        };
      },
      onError: (err) => reject(err),
    });
  });
}

/** Remove existing todos from the browser database */
export function removeTodos(ids: string[]): Promise<string[]> {
  return new Promise((resolve, reject) => {
    openDB({
      onSuccess: (db) => {
        const tx = db.transaction(TODO_STORE, 'readwrite');
        const store = tx.objectStore(TODO_STORE);
        const idIndex = store.index('by_id');

        ids.forEach((id) => {
          const destroy = idIndex.openKeyCursor(IDBKeyRange.only(id));
          destroy.onsuccess = () => {
            const cursor = destroy.result;
            if (cursor) {
              store.delete(cursor.primaryKey);
              cursor.continue();
            }
          };
        });

        tx.onerror = (err) => {
          reject(err);
        };
        tx.oncomplete = () => {
          console.log('🗑️ Removal completed', ids);
          resolve(ids);
        };
      },
      onError: (err) => reject(err),
    });
  });
}
