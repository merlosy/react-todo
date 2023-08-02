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
    const [editingId, setEditingId] = useState<string | null>(null);
    // const { getColors } = useColors();

    function addTodo(text: string, link?: string): string {
        const id = v4();
        setTodos([...todos, { text, id, link }]);
        return id;
    }

    /**
     * @see https://www.boredapi.com/api/activity
     */
    async function populateTodo() {
        const res = await fetch(`https://www.boredapi.com/api/activity`);
        const { activity, link } = await res.json();
        return addTodo(activity, link.length ? link : undefined);
    }

    function startEdit(id: string) {
        setEditingId(id);
    }

    function endEdit(id: string, newText?: string) {
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

