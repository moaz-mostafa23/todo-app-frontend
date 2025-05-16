import React, { useState } from 'react';
import { Todo } from '../types/todo';
import TodoItem from './TodoItem';
import { AnimatePresence } from 'framer-motion';
import useTodos from '../hooks/useTodos';
import TodoFilterButtons from './TodoFilterButtons';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import TodoError from './TodoError';
import TodoFormSection from './TodoFormSection';
import TodoEmptyState from './TodoEmptyState';
import TodoFooter from './TodoFooter';

const TodoList: React.FC = () => {
  const { todos, loading, error: apiError, createTodo, updateTodo, deleteTodo } = useTodos();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayError = error || apiError;

  const handleAddTodo = async (title: string) => {
    try {
      await createTodo({ title });
      setError(null);
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo. Please try again.');
    }
  };

  const handleToggleComplete = async (todoId: string, completed: boolean) => {
    try {
      await updateTodo(todoId, { completed });
      setError(null);
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo status. Please try again.');
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleUpdateTodo = async (title: string) => {
    if (!editingTodo) return;
    
    try {
      await updateTodo(editingTodo.todoId, { title });
      setEditingTodo(null);
      setError(null);
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo. Please try again.');
    }
  };

  const handleDeleteConfirmation = (todoId: string) => {
    setDeletingTodoId(todoId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTodo = async () => {
    if (!deletingTodoId) return;
    
    try {
      await deleteTodo(deletingTodoId);
      setIsDeleteModalOpen(false);
      setDeletingTodoId(null);
      setError(null);
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo. Please try again.');
    }
  };

  const handleClearCompleted = () => {
    const hasCompleted = todos.some(todo => todo.completed);
    if (hasCompleted) {
      setDeletingTodoId('all-completed');
      setIsDeleteModalOpen(true);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center my-6 text-gray-800">My My-Do!</h1>
      
      <TodoFormSection
        editingTodo={editingTodo}
        onUpdateTodo={handleUpdateTodo}
        onAddTodo={handleAddTodo}
        onCancelEdit={() => setEditingTodo(null)}
      />

      <TodoFilterButtons filter={filter} setFilter={setFilter} />

      <TodoError message={displayError} onClose={() => setError(null)} />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <TodoEmptyState loading={loading} filter={filter} todoCount={filteredTodos.length} />

        {!loading && filteredTodos.length > 0 && (
          <AnimatePresence mode="popLayout">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.todoId}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTodo}
                onDelete={handleDeleteConfirmation}
              />
            ))}
          </AnimatePresence>
        )}

        <TodoFooter
          todos={todos}
          onClearCompleted={handleClearCompleted}
        />
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteTodo}
        deletingTodoId={deletingTodoId}
        todos={todos}
        deleteTodo={deleteTodo}
        setError={setError}
      />
    </div>
  );
};

export default TodoList;