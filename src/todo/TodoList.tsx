import { useState } from "react"
import TodoItem from "./TodoItem";
import AddTodo from "./AddTodo";
import { v4 } from "uuid";

type Todo = {
    id: string,
    text: string
}

function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const todoList = todos.map(todo => <li key={todo.id}><TodoItem text={todo.text} /></li>)
    return (
        <>
            <AddTodo addTodo={todo => setTodos([...todos, { text: todo, id: v4() }])}/>
            <ul>
                { todoList }
            </ul>
        </>
    );
}

export default TodoList