import React, { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (title: string) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo, onSubmit, onCancel, isEditing = false }) => {
  const [title, setTitle] = useState('');

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
    } else {
      toast.warning('Please enter some text first!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center w-full gap-2">
        <motion.input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isEditing ? "Update todo..." : "Add a new todo..."}
          className="flex-grow p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          data-testid="todo-input"
          autoFocus
          whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
          transition={{ duration: 0.2 }}
        />
        <motion.button
          type="submit"
          className={`${!title.trim() ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 px-4 rounded-md flex items-center`}
          whileHover={title.trim() ? { scale: 1.05, backgroundColor: '#2563EB' } : { scale: 1 }}
          whileTap={title.trim() ? { scale: 0.95 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isEditing ? 'Update' : (
            <>
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 90, transition: { duration: 0.3 } }}
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" />
              </motion.div>
              Add
            </>
          )}
        </motion.button>
        {isEditing && onCancel && (
          <motion.button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-md flex items-center"
            whileHover={{ scale: 1.05, backgroundColor: '#E5E7EB' }}
            whileTap={{ scale: 0.95 }}
          >
            <XMarkIcon className="h-5 w-5 mr-1" />
            Cancel
          </motion.button>
        )}
      </div>
    </motion.form>
  );
};

export default TodoForm;