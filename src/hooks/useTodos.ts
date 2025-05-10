import { useState, useEffect, useCallback, useRef } from 'react';
import todoService from '../services/todoService';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';
import { debounce } from 'lodash';

interface PendingOperation {
  id: string;
  timestamp: number;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // trackin pending operations to prevent duplicates and race conditions
  const pendingOperationsRef = useRef<Map<string, PendingOperation>>(new Map());
  const DEBOUNCE_TIME = 300;

  const trackOperation = (id: string): boolean => {
    const existingOp = pendingOperationsRef.current.get(id);
    if (existingOp && Date.now() - existingOp.timestamp < 500) {
      return false; 
    }
    
    pendingOperationsRef.current.set(id, {
      id,
      timestamp: Date.now()
    });
    return true;
  };
  
  const clearOperation = (id: string): void => {
    pendingOperationsRef.current.delete(id);
  };

  const fetchTodos = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const debouncedCreateTodoFn = useCallback((input: CreateTodoInput): Promise<Todo> => {
    return new Promise((resolve, reject) => {
      const debouncedFn = debounce(async () => {
        try {
          const result = await todoService.createTodo(input);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, DEBOUNCE_TIME);
      
      debouncedFn();
    });
  }, []);
  
  const createTodo = async (input: CreateTodoInput) => {
    // Create a temporary todo with optimistic data
    const tempId = `temp-${Date.now()}`;
    const optimisticTodo: Todo = {
      todoId: tempId,
      userId: 'temp-user', // replaced with response froom api
      title: input.title,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    // Update UI immediately
    setTodos(prev => [...prev, optimisticTodo]);
    
    if (!trackOperation(tempId)) {
      return;
    }
    
    try {
      setError(null);
      const newTodo = await debouncedCreateTodoFn(input);
      
      setTodos(prev => prev.map(todo => 
        todo.todoId === tempId ? newTodo : todo
      ));
      
      clearOperation(tempId);
      return newTodo;
    } catch (err) {
      setTodos(prev => prev.filter(todo => todo.todoId !== tempId));
      console.error('Error adding todo:', err);
      setError('Failed to add todo. Please try again.');
      clearOperation(tempId);
      throw err;
    }
  };

  const debouncedUpdateTodoFn = useCallback((todoId: string, input: UpdateTodoInput): Promise<Todo> => {
    return new Promise((resolve, reject) => {
      const debouncedFn = debounce(async () => {
        try {
          const result = await todoService.updateTodo(todoId, input);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, DEBOUNCE_TIME);
      
      debouncedFn();
    });
  }, []);

  const updateTodo = async (todoId: string, input: UpdateTodoInput) => {
    const currentTodo = todos.find(todo => todo.todoId === todoId);
    if (!currentTodo) {
      setError('Todo not found');
      throw new Error('Todo not found');
    }
    
    if (!trackOperation(todoId)) {
      return currentTodo; // Return the current todo state
    }
    
    const optimisticTodo: Todo = {
      ...currentTodo,
      ...input
    };
    
    setTodos(prev => prev.map(todo => 
      todo.todoId === todoId ? optimisticTodo : todo
    ));
    
    try {
      setError(null);
      const updatedTodo = await debouncedUpdateTodoFn(todoId, input);
      
      setTodos(prev => prev.map(todo => 
        todo.todoId === todoId ? updatedTodo : todo
      ));
      
      clearOperation(todoId);
      return updatedTodo;
    } catch (err) {
      setTodos(prev => prev.map(todo => 
        todo.todoId === todoId ? currentTodo : todo
      ));
      
      console.error('Error updating todo:', err);
      setError('Failed to update todo. Please try again.');
      clearOperation(todoId);
      throw err;
    }
  };

  const debouncedDeleteTodoFn = useCallback((todoId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const debouncedFn = debounce(async () => {
        try {
          await todoService.deleteTodo(todoId);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, DEBOUNCE_TIME);
      
      debouncedFn();
    });
  }, []);

  const deleteTodo = async (todoId: string) => {
    const todoToDelete = todos.find(todo => todo.todoId === todoId);
    if (!todoToDelete) {
      setError('Todo not found');
      throw new Error('Todo not found');
    }
    
    if (!trackOperation(todoId)) {
      return;
    }
    
    setTodos(prev => prev.filter(todo => todo.todoId !== todoId));
    
    try {
      setError(null);
      await debouncedDeleteTodoFn(todoId);
      
      clearOperation(todoId);
    } catch (err) {
      setTodos(prev => [...prev, todoToDelete]);
      
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo. Please try again.');
      clearOperation(todoId);
      throw err;
    }
  };

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo, 
    deleteTodo
  };
};

export default useTodos;