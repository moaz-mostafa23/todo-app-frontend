export interface Todo {
  userId: string;
  todoId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoInput {
  todoId?: string;
  title?: string;
  completed?: boolean;
}