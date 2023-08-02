import { useState } from "react";
import type { Todo } from "./todo.model";
import { v4 } from "uuid";

// const DB = 'toDoList';

// function useDb() {
//     const todoDb = window.indexedDB.open(DB);
//     todoDb.onerror = e => console.error('Error opening DB, reason:', e);
//     todoDb.onsuccess = () => {
//         console.log('DB open');
//         const db = todoDb.result;
//     }
// }

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    // const { getColors } = useColors();

    function addTodo(text: string, link?: string) {
        const id = v4();
        setTodos([...todos, { text, id, link }]);
        setSelectedTodoId(id);
    }

    /**
     * @see https://www.boredapi.com/api/activity
     */
    async function populateTodo() {
        const res = await fetch(`https://www.boredapi.com/api/activity`);
        const { activity, link } = await res.json();
        addTodo(activity, link.length ? link : undefined);
    }

    function startEdit(id: string) {
        setEditingId(id);
    }

    function endEdit(id: string, newText?: string) {
        console.log('END', newText)
        if (newText?.length) {
            const todoId = todos.findIndex(todo => todo.id === id);
            const newTodos = [...todos];
            newTodos[todoId] = {
                ...newTodos[todoId],
                text: newText
            }
            setTodos(newTodos);
        }
        setEditingId(null);
    }

    function removeTodo(id: string) {
        if (selectedTodoId === id) {
            setSelectedTodoId(null);
        }
        setTodos(todos.filter(todo => todo.id !== id))
    }

    // useEffect(() => {
    //     async function updateTodoColor() {
    //         const todoId = todos.findIndex(todo => todo.id === selectedTodoId);
    //         const colors = await getColors();
    //         const newTodos = [...todos];
    //         newTodos[todoId] = {
    //             ...newTodos[todoId],
    //             bgColor: colors[0].hex
    //         }
    //         setTodos(newTodos);
    //     }
    //     updateTodoColor()
    // }, [selectedTodoId, todos, getColors]);
    
    return { addTodo, startEdit, endEdit, populateTodo, removeTodo, todos, editingId }
}

