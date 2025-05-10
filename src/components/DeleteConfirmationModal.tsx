import React from 'react';
import { Dialog, Description, DialogPanel , DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Todo } from '../types/todo';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  deletingTodoId: string | null;
  todos: Todo[];
  deleteTodo: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  deletingTodoId,
  todos,
  deleteTodo,
  setError
}) => {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-center mb-4">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
          </div>
          <DialogTitle className="text-lg font-medium text-center mb-2">
            {deletingTodoId === 'all-completed' ? 'Clear Completed Todos' : 'Delete Todo'}
          </DialogTitle>
          <Description className="text-center mb-6 text-gray-600">
            {deletingTodoId === 'all-completed' 
              ? 'Are you sure you want to delete all completed todos? This action cannot be undone.'
              : 'Are you sure you want to delete this todo? This action cannot be undone.'}
          </Description>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              onClick={async () => {
                if (deletingTodoId === 'all-completed') {
                  try {
                    const completedTodos = todos.filter(todo => todo.completed);
                    for (const todo of completedTodos) {
                      await deleteTodo(todo.todoId);
                    }
                    onClose();
                    setError(null);
                  } catch (err) {
                    console.error('Error deleting completed todos:', err);
                    setError('Failed to delete completed todos. Please try again.');
                  }
                } else {
                  onDelete();
                  onClose(); 
                }
              }}
            >
              Delete
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DeleteConfirmationModal;