<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTodoStore } from '../stores/todoStore';

const route = useRoute();
const store = useTodoStore();
const newTask = ref('');
const editingId = ref<number | null>(null);
const editText = ref('');

const filter = computed(() => (route.params.filter as string) || 'all');
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'completed':
      return store.todoList.filter(todo => todo.completed);
    case 'pending':
      return store.todoList.filter(todo => !todo.completed);
    case 'important':
      return store.todoList.filter(todo => /quan trọng|important/i.test(todo.text));
    default:
      return store.todoList;
  }
});

const filterTitle = computed(() => {
  switch (filter.value) {
    case 'completed':
      return 'Công việc đã hoàn thành';
    case 'pending':
      return 'Công việc chưa hoàn thành';
    case 'important':
      return 'Việc quan trọng';
    default:
      return 'Tất cả công việc';
  }
});

const startEdit = (todo: { id: number; text: string }) => {
  editingId.value = todo.id;
  editText.value = todo.text;
};

const cancelEdit = () => {
  editingId.value = null;
  editText.value = '';
};

const handleAddTodo = () => {
  const text = newTask.value.trim();
  if (!text) {
    alert('Vui lòng nhập công việc!');
    return;
  }
  if (text.length > 100) {
    alert('Công việc không được vượt quá 100 ký tự!');
    return;
  }
  store.addTodo(text);
  newTask.value = '';
};

const saveEdit = (id: number) => {
  const text = editText.value.trim();
  if (!text) {
    alert('Vui lòng nhập nội dung công việc!');
    return;
  }
  if (text.length > 100) {
    alert('Công việc không được vượt quá 100 ký tự!');
    return;
  }
  store.updateTodo(id, text);
  editingId.value = null;
  editText.value = '';
};

</script>

<template>
  <div class="todo-container">
    <div class="add-todo-section">
      <h2>{{ filterTitle }}</h2>
      <div class="input-group">
        <input 
          v-model="newTask" 
          @keyup.enter="handleAddTodo"
          type="text"
          placeholder="Nhập công việc mới..."
          class="todo-input"
        />
        <button @click="handleAddTodo" class="btn-add">Thêm</button>
      </div>
    </div>
    
    <div v-if="filteredTodos.length === 0" class="empty-state">
      <p>Không có công việc phù hợp với bộ lọc hiện tại.</p>
    </div>
    
    <ul class="todo-list">
      <li v-for="todo in filteredTodos" :key="todo.id" class="todo-item">
        <div v-if="editingId === todo.id" class="edit-mode">
          <input 
            v-model="editText" 
            @keyup.enter="saveEdit(todo.id)" 
            @keyup.esc="cancelEdit" 
            class="edit-input"
            autoFocus
          />
          <button type="button" @click="saveEdit(todo.id)" class="btn-save">Lưu</button>
          <button type="button" @click="cancelEdit" class="btn-cancel">Hủy</button>
        </div>

        <div v-else class="view-mode">
          <input type="checkbox" v-model="todo.completed" class="checkbox" />
          <span :class="{ done: todo.completed }" @dblclick="startEdit(todo)" class="todo-text">{{ todo.text }}</span>
          <div class="button-group">
            <router-link :to="`/todo/${todo.id}`" class="btn-view">Xem</router-link>
            <button @click="startEdit(todo)" class="btn-edit">Sửa</button>
            <button @click="store.removeTodo(todo.id)" class="btn-delete">Xóa</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.todo-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.add-todo-section {
  margin-bottom: 30px;
}

.add-todo-section h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 24px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.todo-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

.btn-add {
  padding: 12px 25px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.btn-add:hover {
  background: #45a049;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 16px;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 15px;
  transition: all 0.3s;
}

.todo-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-mode,
.view-mode {
  display: flex;
  align-items: center;
  gap: 10px;
}

.edit-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #2196F3;
  border-radius: 6px;
  font-size: 14px;
}

.edit-input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(33, 150, 243, 0.3);
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-right: 10px;
}

.todo-text {
  flex: 1;
  padding: 8px;
  cursor: text;
  border-radius: 4px;
  transition: background 0.2s;
}

.todo-text:hover {
  background: #f5f5f5;
}

.todo-text.done {
  text-decoration: line-through;
  color: #999;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-save,
.btn-cancel,
.btn-edit,
.btn-delete,
.btn-view {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-save {
  background: #4CAF50;
  color: white;
}

.btn-save:hover {
  background: #45a049;
}

.btn-cancel {
  background: #f44336;
  color: white;
}

.btn-cancel:hover {
  background: #da190b;
}

.btn-view {
  background: #2196F3;
  color: white;
}

.btn-view:hover {
  background: #0b7dda;
}

.btn-edit {
  background: #FF9800;
  color: white;
}

.btn-edit:hover {
  background: #e68900;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:hover {
  background: #da190b;
}
</style>