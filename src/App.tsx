import { useState } from 'react';

import './App.css'
import TodoList from './todo/TodoList'
import type { Todo } from './todo/todo.model';
import TodoDetails from './todo/TodoDetails';

function isSameTodo(a: Todo | null, b: Todo| null): boolean {
  if (!a || !b) return false;
  return a.id === b.id && a.text === b.text;
}

function App() {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const isOpen = selectedTodo !== null;
  const toggleSidebar = (item: Todo) => {
    isSameTodo(selectedTodo, item) ? setSelectedTodo(null) : setSelectedTodo(item);
  }

  return (
    <>
      <div className={`layout ${isOpen === true ? 'active' : ''}`}>
        <h1>Let's make some todos</h1>
        <main>
            <TodoList todoSelected={toggleSidebar} />
        </main>
        <aside className={isOpen === true ? 'active' : ''}>
          <button type="button" className="btn btn-close" onClick={() => setSelectedTodo(null)}>X</button>
          <TodoDetails todo={selectedTodo} />
        </aside>
      </div>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h2>Vite + React</h2>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
