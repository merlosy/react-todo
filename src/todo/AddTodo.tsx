import { FormEventHandler } from 'react';
import classes from './todo.module.css';

type AddTodoProps = {
  addTodo: (value: string) => void;
};

function AddTodo({ addTodo }: AddTodoProps) {
  /** Propagate the text for the new todo item */
  const onSubmitForm: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const field = (event.target as any).newtodo as HTMLInputElement;
    addTodo(field.value);
    field.value = '';
  };
  return (
    <form onSubmit={onSubmitForm} className={classes.inlineForm}>
      <input name="newtodo" type="text" />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTodo;
