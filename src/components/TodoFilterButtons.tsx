import React from 'react';
import { motion } from 'framer-motion';

type FilterType = 'all' | 'active' | 'completed';

interface TodoFilterButtonsProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

const TodoFilterButtons: React.FC<TodoFilterButtonsProps> = ({ filter, setFilter }) => {
  return (
    <motion.div
      className="flex justify-center mb-6 bg-white rounded-lg p-2 shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="inline-flex rounded-md shadow-sm">
        <motion.button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } border border-gray-200`}
          whileHover={{ scale: filter !== 'all' ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          All
        </motion.button>
        <motion.button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 text-sm font-medium ${
            filter === 'active'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } border-t border-b border-gray-200`}
          whileHover={{ scale: filter !== 'active' ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Active
        </motion.button>
        <motion.button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
            filter === 'completed'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } border border-gray-200`}
          whileHover={{ scale: filter !== 'completed' ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Completed
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TodoFilterButtons;