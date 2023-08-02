import TodoItem from "./TodoItem";
import AddTodo from "./AddTodo";
import classes from './todo.module.css'
import { useTodos } from "./useTodos";
import type { Todo } from "./todo.model";

type ListProps = {
    todoSelected: (todo: Todo) => void
}

function TodoList({ todoSelected }: ListProps) {
    const {
        todos, editingId, addTodo, populateTodo, removeTodo, startEdit, endEdit
    } = useTodos();

    const onToggleEdit = (todo: Todo, id: string, val?: string) => {
        if (id === editingId) {
            endEdit(id, val)
            todoSelected({
                ...todo,
                text: val || ''
            })
        } else {
            startEdit(id)
        }
    }

    const todoList = todos.map(todo => <li key={todo.id}>
        <TodoItem todo={todo}
            onClick={() => todoSelected(todo)}
            isEditing={todo.id === editingId}
            deleteClicked={removeTodo}
            toggleEdit={(id, value) => onToggleEdit(todo, id, value)} />
        </li>)
    return (
        <>
            <button onClick={populateTodo}>Populate</button>
            <AddTodo addTodo={addTodo}/>
            <ul className={classes.list}>
                { todoList }
            </ul>
        </>
    );
}

export default TodoList