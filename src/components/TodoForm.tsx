import React, { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (title: string) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo, onSubmit, onCancel, isEditing = false }) => {
  const [title, setTitle] = useState('');
  
  // If editing an existing todo, populate the form with its data
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
    }
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center w-full gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isEditing ? "Update todo..." : "Add a new todo..."}
          className="flex-grow p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          data-testid="todo-input"
          autoFocus
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors flex items-center"
          disabled={!title.trim()}
        >
          {isEditing ? 'Update' : (
            <>
              <PlusCircleIcon className="h-5 w-5 mr-1" />
              Add
            </>
          )}
        </button>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-md transition-colors flex items-center"
          >
            <XMarkIcon className="h-5 w-5 mr-1" />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;