import React from 'react';
import TodoForm from './TodoForm';
import { Todo } from '../types/todo';

interface TodoFormSectionProps {
  editingTodo: Todo | null;
  onUpdateTodo: (title: string) => Promise<void>;
  onAddTodo: (title: string) => Promise<void>;
  onCancelEdit: () => void;
}

const TodoFormSection: React.FC<TodoFormSectionProps> = ({
  editingTodo,
  onUpdateTodo,
  onAddTodo,
  onCancelEdit
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {editingTodo ? (
        <div className="mb-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Edit Todo</h2>
          <TodoForm 
            todo={editingTodo} 
            onSubmit={onUpdateTodo} 
            onCancel={onCancelEdit} 
            isEditing 
          />
        </div>
      ) : (
        <TodoForm onSubmit={onAddTodo} />
      )}
    </div>
  );
};

export default TodoFormSection;
