import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// stores/todoStore.ts
export const useTodoStore = defineStore('todo', () => {
  const todoList = ref<Todo[]>([]);

  const addTodo = (text: string) => todoList.value.push({ id: Date.now(), text, completed: false });

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

  return { todoList, addTodo, removeTodo, updateTodo };
});