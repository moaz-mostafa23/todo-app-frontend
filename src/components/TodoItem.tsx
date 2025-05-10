import React from 'react';
import { Todo } from '../types/todo';
import { format } from 'date-fns';
import { CheckCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (todoId: string, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onEdit, onDelete }) => {
  const formattedDate = format(new Date(todo.createdAt), 'MMM d, yyyy');

  return (
    <div className={`flex items-center justify-between p-4 border-b transition-all ${todo.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-center gap-3 flex-grow">
        <button
          onClick={() => onToggleComplete(todo.todoId, !todo.completed)}
          className="flex-shrink-0 focus:outline-none"
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {todo.completed ? (
            <CheckCircleSolidIcon className="h-6 w-6 text-green-500" />
          ) : (
            <CheckCircleIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
          )}
        </button>
        <div className="flex-grow">
          <p className={`text-sm md:text-base ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
            {todo.title}
          </p>
          <p className="text-xs text-gray-500">Created: {formattedDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => onEdit(todo)}
          className="p-1 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors"
          aria-label="Edit todo"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(todo.todoId)}
          className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-none transition-colors"
          aria-label="Delete todo"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;