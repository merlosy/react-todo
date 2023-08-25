import AddTodo from './AddTodo';
import TodoItem from './TodoItem';
import type { Todo } from './todo.model';
import classes from './todo.module.css';
import { useTodos } from './useTodos';

type ListProps = {
  todoSelected: (todo: Todo) => void;
  onlineSince?: Date;
};

function TodoList({ todoSelected, onlineSince }: ListProps) {
  const { todos, editingId, addTodo, populateTodo, removeTodo, startEdit, endEdit } = useTodos(onlineSince);

  const onToggleEdit = (todo: Todo, id: string, val?: string) => {
    if (id === editingId) {
      endEdit(id, val);
      todoSelected({
        ...todo,
        text: val || '',
      });
    } else {
      startEdit(id);
    }
  };

  const todoList = todos.map((todo) => (
    <li key={todo.id}>
      <TodoItem
        todo={todo}
        onClick={() => todoSelected(todo)}
        isEditing={todo.id === editingId}
        deleteClicked={removeTodo}
        toggleEdit={(id, value) => onToggleEdit(todo, id, value)}
      />
    </li>
  ));
  return (
    <>
      <button onClick={populateTodo} title="Populate">
        <i className="fa-sharp fa-solid fa-question"></i>
      </button>
      <AddTodo addTodo={addTodo} />
      <ul className={classes.list}>{todoList}</ul>
    </>
  );
}

export default TodoList;
