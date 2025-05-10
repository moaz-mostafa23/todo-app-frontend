import client from '../lib/client';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    const response = await client.get('/todos');
    return response.data;
  },

  async createTodo(input: CreateTodoInput): Promise<Todo> {
    const response = await client.post('/todos', {
      title: input.title,
    });
    return response.data;
  },
  
  async updateTodo(todoId: string, input: UpdateTodoInput): Promise<Todo> {
    const response = await client.put(`/todos/${todoId}`, input);
    return response.data;
  },

  async deleteTodo(todoId: string): Promise<void> {
    await client.delete(`/todos/${todoId}`);
  },
};

export default todoService;
