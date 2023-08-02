import TodoItem from "./TodoItem";
import AddTodo from "./AddTodo";
import classes from './todo.module.css'
import { useTodos } from "./useTodos";

function TodoList() {
    const {
        todos, editingId, addTodo, populateTodo, removeTodo, startEdit, endEdit
    } = useTodos();

    const todoList = todos.map(todo => <li key={todo.id}>
        <TodoItem todo={todo}
            isEditing={todo.id === editingId}
            deleteClicked={removeTodo}
            toggleEdit={(id, val) => id === editingId ? endEdit(id, val) : startEdit(id)} />
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