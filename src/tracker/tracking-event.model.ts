import type { Todo } from './../todo/todo.model';

/** Dictionary of all events that can be published/subscribed in the application */
export type AppEvents = {
  'todo-added': Todo;
  'todo-removed': Pick<Todo, 'id'>;
  error: { emitAt: Date; message: string; data: any };
};

export type AppError = {
  emitAt: Date;
  message: string;
  data: any;
};
