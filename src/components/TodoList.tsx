import React, { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { Dialog } from '@headlessui/react';
import todoService from '../services/todoService'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoService.getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to load todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (title: string) => {
    try {
      const newTodo = await todoService.createTodo({ title });
      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo. Please try again.');
    }
  };

  const handleToggleComplete = async (todoId: string, completed: boolean) => {
    try {
      const updatedTodo = await todoService.updateTodo(todoId, { completed });
      setTodos(prev => prev.map(todo => todo.todoId === todoId ? updatedTodo : todo));
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
      const updatedTodo = await todoService.updateTodo(editingTodo.todoId, { title });
      setTodos(prev => prev.map(todo => todo.todoId === editingTodo.todoId ? updatedTodo : todo));
      setEditingTodo(null);
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
      await todoService.deleteTodo(deletingTodoId);
      setTodos(prev => prev.filter(todo => todo.todoId !== deletingTodoId));
      setIsDeleteModalOpen(false);
      setDeletingTodoId(null);
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo. Please try again.');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center my-6 text-gray-800">My Sellou-Do!</h1>
      
      {/* Todo Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {editingTodo ? (
          <div className="mb-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Edit Todo</h2>
            <TodoForm 
              todo={editingTodo} 
              onSubmit={handleUpdateTodo} 
              onCancel={() => setEditingTodo(null)} 
              isEditing 
            />
          </div>
        ) : (
          <TodoForm onSubmit={handleAddTodo} />
        )}
      </div>

      {/* Filters */}
      <div className="flex justify-center mb-6 bg-white rounded-lg p-2 shadow-sm">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-200`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 text-sm font-medium ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border-t border-b border-gray-200`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              filter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-200`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Close</span>
            <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Todo List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your todos...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {filter === 'all' ? (
              <p>No todos yet. Add one above!</p>
            ) : filter === 'active' ? (
              <p>No active todos. Great job!</p>
            ) : (
              <p>No completed todos.</p>
            )}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.todoId}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTodo}
              onDelete={handleDeleteConfirmation}
            />
          ))
        )}

        {/* Summary footer */}
        {todos.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t text-sm text-gray-600 flex justify-between">
            <span>{todos.filter(todo => !todo.completed).length} items left</span>
            <button 
              onClick={() => {
                const hasCompleted = todos.some(todo => todo.completed);
                if (hasCompleted) {
                  setDeletingTodoId('all-completed');
                  setIsDeleteModalOpen(true);
                }
              }}
              disabled={!todos.some(todo => todo.completed)}
              className="text-gray-600 hover:text-red-700 disabled:text-gray-400 disabled:hover:text-gray-400"
            >
              Clear completed
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <Dialog 
        open={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
            </div>
            <Dialog.Title className="text-lg font-medium text-center mb-2">
              {deletingTodoId === 'all-completed' ? 'Clear Completed Todos' : 'Delete Todo'}
            </Dialog.Title>
            <Dialog.Description className="text-center mb-6 text-gray-600">
              {deletingTodoId === 'all-completed' 
                ? 'Are you sure you want to delete all completed todos? This action cannot be undone.'
                : 'Are you sure you want to delete this todo? This action cannot be undone.'}
            </Dialog.Description>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                onClick={async () => {
                  if (deletingTodoId === 'all-completed') {
                    // Delete all completed todos
                    try {
                      const completedTodos = todos.filter(todo => todo.completed);
                      await Promise.all(completedTodos.map(todo => 
                        todoService.deleteTodo(todo.todoId)
                      ));
                      setTodos(prev => prev.filter(todo => !todo.completed));
                      setIsDeleteModalOpen(false);
                    } catch (err) {
                      console.error('Error deleting completed todos:', err);
                      setError('Failed to delete completed todos. Please try again.');
                    }
                  } else {
                    handleDeleteTodo();
                  }
                }}
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default TodoList;