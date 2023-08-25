import { useEffect } from 'react';
import { addError, clearErrors, readErrors } from '../error/error-storage';
import { Todo } from '../todo/todo.model';
import { todoEventBus } from '../util/event-bus';
import { useIsOnline } from '../util/useIsOnline';
import { AppError } from './tracking-event.model';

/**
 * Due to React strict mode, the component renders twice in dev (only once in prod).
 * Keeping this state in memory prevents duplicated subscriptions
 */
let registrations: Array<{ unsubscribe: () => void }> = [];

function onTodoAdded(todo: Todo) {
  console.log('📢 todo-added', todo);
  // Additional work here...
}

function onTodoRemoved(todoId: Pick<Todo, 'id'>) {
  console.log('📢 todo-deleted', todoId);
  // Additional work here...
}

async function postError(error: AppError) {
  console.log('📤 Propagating error to remote service', error);
}

async function onError(error: AppError) {
  if (navigator.onLine) {
    // push to remote service
    postError(error);
  } else {
    console.log('📥 Storing error for later', error);
    // store to indexeddb
    await addError(error);
  }
}

export function useUserTracking() {
  const { isOnline } = useIsOnline();

  useEffect(() => {
    registrations.push(
      todoEventBus.subscribe('todo-added', onTodoAdded),
      todoEventBus.subscribe('todo-removed', onTodoRemoved),
      todoEventBus.subscribe('error', onError)
    );

    console.log('🟢 User tracking registered', todoEventBus.getSubscriptionCount());

    return () => {
      registrations.forEach((r) => r.unsubscribe());
      registrations = [];
      console.log('🔴 User tracking unregistered', todoEventBus.getSubscriptionCount());
    };
  }, []);

  useEffect(() => {
    async function syncErrors() {
      const errors = await readErrors();
      if (isOnline) {
        console.log('⚡ Connection restored: syncing errors');
        await Promise.all(errors.map(postError));
        await clearErrors();
      }
    }
    syncErrors();
  }, [isOnline]);
}
