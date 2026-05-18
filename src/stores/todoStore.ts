import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  important: boolean;
}

const STORAGE_KEY = 'vue3-typescript-todos';

const loadTodos = (): Todo[] => {
  const savedTodos = localStorage.getItem(STORAGE_KEY);
  if (!savedTodos) {
    return [];
  }

  try {
    const parsedTodos = JSON.parse(savedTodos) as Partial<Todo>[];
    return parsedTodos
      .filter((todo) => typeof todo.id === 'number' && typeof todo.text === 'string')
      .map((todo) => ({
        id: todo.id as number,
        text: todo.text as string,
        completed: Boolean(todo.completed),
        important: Boolean(todo.important) || /quan trọng|quan trong|important/i.test(todo.text as string)
      }));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

export const useTodoStore = defineStore('todo', () => {
  const todoList = ref<Todo[]>(loadTodos());

  const addTodo = (text: string, important = false) =>
    todoList.value.push({ id: Date.now(), text, completed: false, important });

  const removeTodo = (id: number) => {
    const current = todoList.value.slice();
    const index = current.findIndex(t => t.id === id);
    if (index !== -1) {
      current.splice(index, 1);
      todoList.value = current;
    }
  };

  const updateTodo = (id: number, newText: string) => {
    const current = todoList.value.slice();  // Sử dụng todoList thay vì store
    const index = current.findIndex(t => t.id === id);
    if (index !== -1) {
      const todo = current[index];
      if (todo) {
        todo.text = newText;
        todoList.value = current;
      }
    }
  };

  watch(
    todoList,
    (todos) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    },
    { deep: true }
  );

  return { todoList, addTodo, removeTodo, updateTodo };
});
