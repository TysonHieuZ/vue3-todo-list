<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTodoStore } from '../stores/todoStore';
import type { Todo } from '../stores/todoStore';

const route = useRoute();
const store = useTodoStore();
const newTask = ref('');
const editingId = ref<number | null>(null);
const editText = ref('');

const filter = computed(() => (route.params.filter as string) || 'all');
const filteredTodos = computed(() => {
  const items = store.todoList.slice();
  const result: Todo[] = [];

  for (const todo of items) {
    if (filter.value === 'completed' && todo.completed) {
      result.push(todo);
    } else if (filter.value === 'pending' && !todo.completed) {
      result.push(todo);
    } else if (filter.value === 'important' && /quan trọng|important/i.test(todo.text)) {
      result.push(todo);
    } else if (filter.value === 'all') {
      result.push(todo);
    }
  }

  return result;
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

const editingTodo = computed(() => {
  if (editingId.value === null) {
    return null;
  }
  return store.todoList.find(todo => todo.id === editingId.value) || null;
});

const startEdit = (todo: Todo) => {
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

const saveEdit = (id: number | null) => {
  if (id === null) return;
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

    <div v-if="editingTodo" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Chỉnh sửa công việc</h3>
          <button type="button" class="modal-close" @click="cancelEdit">×</button>
        </div>
        <form @submit.prevent="saveEdit(editingId)">
          <div class="form-row">
            <label for="editText">Nội dung công việc</label>
            <input
              id="editText"
              v-model="editText"
              type="text"
              placeholder="Nhập nội dung sửa..."
              class="todo-input"
            />
          </div>

          <div class="form-row">
            <label for="todoStatus">Trạng thái</label>
            <select id="todoStatus" disabled class="todo-input">
              <option>{{ editingTodo.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành' }}</option>
            </select>
          </div>

          <div class="button-group modal-buttons">
            <button type="submit" class="btn-save">Lưu</button>
            <button type="button" @click="cancelEdit" class="btn-cancel">Hủy</button>
          </div>
        </form>
      </div>
    </div>
    
    <div v-if="filteredTodos.length === 0" class="empty-state">
      <p>Không có công việc phù hợp với bộ lọc hiện tại.</p>
    </div>
    
    <ul class="todo-list">
      <li v-for="todo in filteredTodos" :key="todo.id" class="todo-item" :class="{ editing: editingId === todo.id }">
          <div class="view-mode">
            <input type="checkbox" v-model="todo.completed" class="checkbox" />
            <span :class="{ done: todo.completed }" class="todo-text">{{ todo.text }}</span>
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #1f5fa8;
}

.modal-close {
  border: none;
  background: transparent;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  color: #666;
  padding: 0;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.form-row label {
  color: #444;
  font-size: 14px;
  font-weight: 600;
}

.button-group.modal-buttons {
  justify-content: flex-end;
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