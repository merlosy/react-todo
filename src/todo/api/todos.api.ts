import { restApi } from '../../util/request';
import { Todo } from '../todo.model';

/**
 * RESTful and stateless API endpoint to manage CRUD operations with Todos
 */
const TODO_API = 'http://localhost:5000/api/';

function toSyncedTodo(todoDTO: any) {
  const todo = { ...todoDTO };
  if (todo.createdAt) {
    todo.createdAt = new Date(todo.createdAt);
  }
  if (todo.updatedAt) {
    todo.updatedAt = new Date(todo.updatedAt);
  }
  if (todo.deletedAt) {
    todo.deletedAt = new Date(todo.deletedAt);
  }
  todo.isSynced = true;
  return todo as Todo;
}

export async function loadTodosFromAPI() {
  let todos: Todo[] = [];
  try {
    todos = await restApi.get<Todo[]>(TODO_API + 'todos');
  } catch (err) {
    // Extra work
  }
  return todos?.map(toSyncedTodo);
}

export async function createTodoAPI(todo: Todo) {
  let hasError = false;
  const todoDTO = {
    ...todo,
    createdAt: todo.createdAt?.toISOString(),
  };
  try {
    await restApi.post(TODO_API + 'todos', todoDTO);
  } catch (err) {
    hasError = true;
  }
  return { ...todo, isSynced: !hasError };
}

export async function updateTodoAPI(todo: Todo) {
  let hasError = false;
  const todoDTO = {
    ...todo,
    createdAt: todo.createdAt?.toISOString(),
    updatedAt: todo.updatedAt?.toISOString(),
  };
  try {
    await restApi.put(TODO_API + 'todos/' + todo.id, todoDTO);
  } catch (err) {
    hasError = true;
  }
  return { ...todo, isSynced: !hasError };
}

export async function removeTodoFromAPI(todoId: string): Promise<string | undefined> {
  try {
    await restApi.delete(TODO_API + 'todos/' + encodeURIComponent(todoId));
    return todoId;
  } catch (err) {
    // Extra work
  }
  return undefined;
}
