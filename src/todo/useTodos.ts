import { useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid';

import { partition } from '../util/array';
import { createTodoAPI, loadTodosFromAPI, removeTodoFromAPI, updateTodoAPI } from './api/todos.api';
import { insertTodos, readTodos, removeTodos } from './storage/todo-storage';
import type { Todo } from './todo.model';

export function useTodos(onlineSince?: Date) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  function addTodo(text: string, link?: string) {
    const id = v4();
    const newTodo: Todo = { text, id, link, todoBefore: [], createdAt: new Date(), isSynced: false };
    setTodos([...todos, newTodo]);
    return id;
  }

  /**
   * @see https://www.boredapi.com/api/activity
   */
  async function populateTodo() {
    // Try catch http errors and log to store
    const res = await fetch(`https://www.boredapi.com/api/activity`);
    const { activity, link } = await res.json();
    return addTodo(activity, link.length ? link : undefined);
  }

  function startEdit(id: string) {
    setEditingId(id);
  }

  function endEdit(id: string, newText?: string) {
    if (newText?.length) {
      const todoId = todos.findIndex((todo) => todo.id === id);
      const newTodos = [...todos];
      newTodos[todoId] = {
        ...newTodos[todoId],
        text: newText,
        updatedAt: new Date(),
        isSynced: false,
      };
      setTodos(newTodos);
    }
    setEditingId(null);
  }

  function removeTodo(id: string) {
    const [todosToRemove, remainingTodos] = partition(todos, (todo) => todo.id === id);
    const toRemove = todosToRemove.map((todo) => ({ ...todo, deletedAt: new Date(), isSynced: false }));
    setTodos([...remainingTodos, ...toRemove]);
  }

  /* Sync READ with API, then DB, then state */
  useEffect(() => {
    async function initTodosOnline() {
      if (!onlineSince) return;
      let remoteTodos = await loadTodosFromAPI();
      // Do not include locally deleted todos
      const localDeletedIds = todos.filter((t) => !t.isSynced && !!t.deletedAt).map((t) => t.id);
      // console.log('Locally deleted', localDeletedIds);
      if (localDeletedIds.length) {
        remoteTodos = remoteTodos?.filter((todo) => localDeletedIds.includes(todo.id));
      }
      // Compare updated todos, most recent is kept
      const localUpdatedAtMap = todos.reduce((acc, t) => ({ ...acc, [t.id]: t.updatedAt }), {} as Record<string, Date | undefined>);
      remoteTodos = remoteTodos?.filter((todo) => {
        const localUpdateAt = localUpdatedAtMap[todo.id];
        if (todo.updatedAt && localUpdateAt) {
          return todo.updatedAt < localUpdateAt;
        }
        if (localUpdateAt && !todo.updatedAt) {
          return false;
        }
        return true;
      });
      if (remoteTodos?.length) {
        await insertTodos(remoteTodos);
      }
      setTodos(await readTodos());
    }
    initTodosOnline();
  }, [onlineSince]); // Do once on mount

  /* Sync creation, updates and deletes with DB */
  useEffect(() => {
    /** Detect unsynced todos and try to sync them */
    async function runTodosSyncOffline() {
      if (onlineSince) return;
      // eslint-disable-next-line prefer-const
      let [newTodos, otherTodos] = partition(todos, (todo) => !todo.updatedAt && !todo.deletedAt);
      if (newTodos.length) {
        // Create local todos
        console.log('⏳ Syncing local new todos:', newTodos);
        await insertTodos(newTodos);
        console.log('✅ Local creation completed');
      }
      const [todosToUpdate, todosToDelete] = partition(otherTodos, (todo) => !todo.deletedAt);
      if (todosToUpdate.length) {
        // Update local todos
        console.log('⏳ Syncing local update todos:', todosToUpdate);
        await insertTodos(todosToUpdate);
        console.log('✅ Local update completed');
      }
      if (todosToDelete.length) {
        // Remove remote todos
        console.log('⏳ Syncing local remove todos:', todosToDelete);
        await insertTodos(todosToDelete);
        console.log('✅ Sync removal completed');
      }
    }
    runTodosSyncOffline();
  }, [todos, onlineSince]);

  /* Sync creation, updates and deletes with DB */
  useEffect(() => {
    /** Detect unsynced todos and try to sync them */
    async function runTodosSync() {
      let hasChanged = false;
      if (!onlineSince) return;
      const [syncedTodos, unsyncedTodos] = partition(todos, (todo) => todo.isSynced);
      // eslint-disable-next-line prefer-const
      let [newTodos, otherTodos] = partition(unsyncedTodos, (todo) => !todo.updatedAt && !todo.deletedAt);
      if (newTodos.length) {
        // Create remote todos
        console.log('⏳ Syncing new todos:', newTodos);
        try {
          newTodos = await Promise.all(newTodos.map(createTodoAPI));
          await insertTodos(newTodos);
          console.log('✅ Sync creation completed');
          hasChanged = true;
        } catch (err) {
          console.error('API> Failed to store new todos');
        }
      }
      let [todosToUpdate, todosToDelete] = partition(otherTodos, (todo) => !todo.deletedAt);
      if (todosToUpdate.length) {
        // Update remote todos
        console.log('⏳ Syncing updating todos:', todosToUpdate);
        try {
          todosToUpdate = await Promise.all(todosToUpdate.map(updateTodoAPI));
          await insertTodos(todosToUpdate);
          console.log('✅ Sync update completed');
          hasChanged = true;
        } catch (err) {
          console.error('API> Failed to update todos');
        }
      }
      if (todosToDelete.length) {
        // Remove remote todos
        console.log('⏳ Syncing removing todos:', todosToDelete);
        try {
          const deletedIds = await Promise.all(todosToDelete.map((todo) => removeTodoFromAPI(todo.id)));
          todosToDelete = [];
          await removeTodos(deletedIds.filter((i) => !!i) as string[]);
          console.log('✅ Sync removal completed');
          hasChanged = true;
        } catch (err) {
          console.error('API> Failed to remove todos');
        }
      }
      if (hasChanged) {
        setTodos([...syncedTodos, ...newTodos, ...todosToUpdate, ...todosToDelete]);
      }
    }
    runTodosSync();
  }, [todos, onlineSince]);

  return {
    addTodo,
    startEdit,
    endEdit,
    populateTodo,
    removeTodo,
    /** Memoized list of sorted todos excluding deleted items */
    todos: useMemo(() => todos.filter((todo) => !todo.deletedAt), [todos]).sort((a, b) => a.text.localeCompare(b.text)),
    editingId,
  };
}
