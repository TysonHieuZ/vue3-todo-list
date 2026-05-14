import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// stores/todoStore.ts
export const useTodoStore = defineStore('todo', () => {
  const todoList = ref<Todo[]>([]);

  const addTodo = (text: string) => todoList.value.push({ id: Date.now(), text, completed: false });
  const removeTodo = (id: number) => todoList.value = todoList.value.filter(t => t.id !== id);
  
  const updateTodo = (id: number, newText: string) => {
    // Cách này cực nhanh và Vue bắt được thay đổi ngay
    todoList.value = todoList.value.map(t => 
      t.id === id ? { ...t, text: newText } : t
    );
  };

  return { todoList, addTodo, removeTodo, updateTodo };
});