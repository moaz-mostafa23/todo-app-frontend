import React from 'react';
import { Todo } from '../types/todo';
import { format } from 'date-fns';
import { CheckCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (todoId: string, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onEdit, onDelete }) => {
  const formattedDate = format(new Date(todo.createdAt), 'MMM d, yyyy');

  return (
    <motion.div
      className={`flex items-center justify-between p-4 border-b ${todo.completed ? 'bg-gray-50' : 'bg-white'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
      layout
    >
      <div className="flex items-center gap-3 flex-grow">
        <motion.button
          onClick={() => onToggleComplete(todo.todoId, !todo.completed)}
          className="flex-shrink-0 focus:outline-none"
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          {todo.completed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <CheckCircleSolidIcon className="h-6 w-6 text-green-500" />
            </motion.div>
          ) : (
            <CheckCircleIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
          )}
        </motion.button>
        <div className="flex-grow">
          <motion.p
            className={`text-sm md:text-base ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}
            animate={{ opacity: todo.completed ? 0.6 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {todo.title}
          </motion.p>
          <p className="text-xs text-gray-500">Created: {formattedDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <motion.button
          onClick={() => onEdit(todo)}
          className="p-1 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
          aria-label="Edit todo"
          whileHover={{ scale: 1.2, backgroundColor: "#EBF5FF" }}
          whileTap={{ scale: 0.9 }}
        >
          <PencilIcon className="h-5 w-5" />
        </motion.button>
        <motion.button
          onClick={() => onDelete(todo.todoId)}
          className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-none"
          aria-label="Delete todo"
          whileHover={{ scale: 1.2, backgroundColor: "#FEE2E2" }}
          whileTap={{ scale: 0.9 }}
        >
          <TrashIcon className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TodoItem;