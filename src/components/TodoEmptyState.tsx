import React from 'react';

interface TodoEmptyStateProps {
  loading: boolean;
  filter: 'all' | 'active' | 'completed';
  todoCount: number;
}

const TodoEmptyState: React.FC<TodoEmptyStateProps> = ({ loading, filter, todoCount }) => {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your todos...</p>
      </div>
    );
  }
  
  if (todoCount === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {filter === 'all' ? (
          <p>No todos yet. Add one above!</p>
        ) : filter === 'active' ? (
          <p>No active todos. Great job!</p>
        ) : (
          <p>No completed todos.</p>
        )}
      </div>
    );
  }
  
  return null;
};

export default TodoEmptyState;
