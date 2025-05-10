import React from 'react';
import { Todo } from '../types/todo';

interface TodoFooterProps {
  todos: Todo[];
  onClearCompleted: () => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({ todos, onClearCompleted }) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  
  if (todos.length === 0) {
    return null;
  }
  
  return (
    <div className="px-6 py-4 bg-gray-50 border-t text-sm text-gray-600 flex justify-between">
      <span>{activeTodosCount} items left</span>
      <button 
        onClick={onClearCompleted}
        disabled={!hasCompletedTodos}
        className="text-gray-600 hover:text-red-700 disabled:text-gray-400 disabled:hover:text-gray-400"
      >
        Clear completed
      </button>
    </div>
  );
};

export default TodoFooter;