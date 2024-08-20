import { create } from "zustand";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type TodoStore = {
  todos: Todo[];
  fetchTodos: () => void;
};

const URL = "http://localhost:8000/api";

export const useStore = create<TodoStore>((set) => ({
  todos: [],
  fetchTodos: async () => {
    try {
      const response = await fetch(`${URL}/chat`);
      const todos = await response.json();
      set({ todos });
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }
}));
