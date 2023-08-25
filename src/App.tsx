import { useState } from 'react';

import './App.css';
import TodoDetails from './todo/TodoDetails';
import TodoList from './todo/TodoList';
import type { Todo } from './todo/todo.model';
import { useUserTracking } from './tracker/useUserTracking';
import { useIsOnline } from './util/useIsOnline';

function isSameTodo(a: Todo | null, b: Todo | null): boolean {
  if (!a || !b) return false;
  return a.id === b.id && a.text === b.text;
}

function App() {
  const { isOnline, onlineSince } = useIsOnline();
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  // Register trackers here (once)
  useUserTracking();

  const isOpen = selectedTodo !== null;
  const toggleSidebar = (item: Todo) => {
    isSameTodo(selectedTodo, item) ? setSelectedTodo(null) : setSelectedTodo(item);
  };

  return (
    <>
      <div className={`layout ${isOpen === true ? 'active' : ''}`}>
        <h1>
          Let's make some todos
          <span className={`network ${isOnline === true ? 'network-on' : ''}`} title={onlineSince?.toLocaleTimeString()}></span>
        </h1>
        <main>
          <TodoList todoSelected={toggleSidebar} onlineSince={onlineSince} />
        </main>
        <aside className={isOpen === true ? 'active' : ''}>
          <button type="button" className="btn btn-close" onClick={() => setSelectedTodo(null)}>
            X
          </button>
          <TodoDetails todo={selectedTodo} />
        </aside>
      </div>
    </>
  );
}

export default App;
