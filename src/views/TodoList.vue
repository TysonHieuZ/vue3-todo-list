<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { usePermissionStore } from '../stores/permissionStore';
import { useTodoStore } from '../stores/todoStore';
import type { Todo } from '../stores/todoStore';

const route = useRoute();
const store = useTodoStore();
const permissionStore = usePermissionStore();
const newTask = ref('');
const editingId = ref<number | null>(null);
const editText = ref('');

const filter = computed(() => (route.params.filter as string) || 'all');
const canAddInCurrentFilter = computed(() => ['all', 'important'].includes(filter.value));
const isCompletedFilter = computed(() => filter.value === 'completed');
const canCreateTodo = computed(
  () => permissionStore.currentPermission.canCreate && canAddInCurrentFilter.value
);
const canChangeTodo = computed(
  () => permissionStore.currentPermission.canEdit && !isCompletedFilter.value
);
const canDeleteTodo = computed(
  () => permissionStore.currentPermission.canDelete && !isCompletedFilter.value
);

const filteredTodos = computed(() => {
  const items = store.todoList.slice();
  const result: Todo[] = [];
  for (const todo of items) {
    if (filter.value === 'completed' && todo.completed) result.push(todo);
    else if (filter.value === 'pending' && !todo.completed) result.push(todo);
    else if (filter.value === 'important' && todo.important) result.push(todo);
    else if (filter.value === 'all') result.push(todo);
  }
  return result;
});

const filterTitle = computed(() => {
  switch (filter.value) {
    case 'completed': return '✅ Đã hoàn thành';
    case 'pending': return '🔄 Chưa hoàn thành';
    case 'important': return '⭐ Việc quan trọng';
    default: return '🌸 Tất cả công việc';
  }
});

const filterEmoji = computed(() => {
  switch (filter.value) {
    case 'completed': return '✅';
    case 'pending': return '🌿';
    case 'important': return '⭐';
    default: return '🌸';
  }
});

const lockedMessage = computed(() => {
  if (!permissionStore.currentPermission.canCreate)
    return 'Vai trò hiện tại chỉ được xem, chưa thể thêm công việc mới.';
  if (!canAddInCurrentFilter.value)
    return 'Bộ lọc này chỉ dùng để xem. Hãy thêm ở "Tất cả" hoặc "Quan trọng".';
  return '';
});

const editingTodo = computed(() => {
  if (editingId.value === null) return null;
  return store.todoList.find((todo) => todo.id === editingId.value) || null;
});

const startEdit = (todo: Todo) => {
  if (!canChangeTodo.value) return;
  editingId.value = todo.id;
  editText.value = todo.text;
};

const cancelEdit = () => {
  editingId.value = null;
  editText.value = '';
};

const validateTodoText = (text: string) => {
  if (!text) { alert('Vui lòng nhập công việc! 🌸'); return false; }
  if (text.length > 100) { alert('Công việc không được vượt quá 100 ký tự! 💕'); return false; }
  return true;
};

const handleAddTodo = () => {
  if (!canCreateTodo.value) return;
  const text = newTask.value.trim();
  if (!validateTodoText(text)) return;
  store.addTodo(text, filter.value === 'important');
  newTask.value = '';
};

const saveEdit = (id: number | null) => {
  if (id === null || !canChangeTodo.value) return;
  const text = editText.value.trim();
  if (!validateTodoText(text)) return;
  store.updateTodo(id, text);
  editingId.value = null;
  editText.value = '';
};
</script>

<template>
  <div class="todo-container">
    <!-- Page header -->
    <div class="page-header">
      <div class="page-icon">{{ filterEmoji }}</div>
      <div class="page-title-group">
        <h2 class="page-title">{{ filterTitle }}</h2>
        <p class="page-count">{{ filteredTodos.length }} công việc</p>
      </div>
    </div>

    <!-- Add todo section -->
    <div class="add-section">
      <div v-if="canCreateTodo" class="input-group">
        <div class="input-wrapper">
          <span class="input-prefix">✏️</span>
          <input
            v-model="newTask"
            @keyup.enter="handleAddTodo"
            type="text"
            placeholder="Thêm một điều mới vào ngày của bạn..."
            class="todo-input"
          />
        </div>
        <button @click="handleAddTodo" class="btn-add">
          <span>+ Thêm</span>
        </button>
      </div>

      <div v-else class="locked-state">
        <span>🔒</span>
        <span>{{ lockedMessage }}</span>
      </div>
    </div>

    <!-- Edit modal -->
    <Transition name="modal">
      <div v-if="editingTodo" class="modal-overlay" @click.self="cancelEdit">
        <div class="modal-card">
          <div class="modal-header">
            <div class="modal-title-group">
              <span class="modal-icon">✏️</span>
              <h3>Chỉnh sửa công việc</h3>
            </div>
            <button type="button" class="modal-close" @click="cancelEdit" aria-label="Đóng">✕</button>
          </div>

          <form @submit.prevent="saveEdit(editingId)">
            <div class="form-field">
              <label for="editText">Nội dung</label>
              <input
                id="editText"
                v-model="editText"
                type="text"
                placeholder="Nhập nội dung..."
                class="todo-input"
                autofocus
              />
            </div>

            <div class="form-field">
              <label>Trạng thái</label>
              <div class="status-badge" :class="{ done: editingTodo.completed }">
                {{ editingTodo.completed ? '✅ Đã hoàn thành' : '🔄 Chưa hoàn thành' }}
              </div>
            </div>

            <div class="modal-actions">
              <button type="submit" class="btn-save">💾 Lưu</button>
              <button type="button" @click="cancelEdit" class="btn-cancel">Hủy</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Empty state -->
    <div v-if="filteredTodos.length === 0" class="empty-state">
      <div class="empty-icon">🌸</div>
      <p class="empty-title">Trống trải quá...</p>
      <p class="empty-sub">Hãy thêm công việc đầu tiên của bạn!</p>
    </div>

    <!-- Todo list -->
    <TransitionGroup name="list" tag="ul" class="todo-list">
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="todo-item"
        :class="{ done: todo.completed, readonly: isCompletedFilter }"
      >
        <!-- Checkbox -->
        <div class="item-check">
          <input
            type="checkbox"
            v-model="todo.completed"
            class="checkbox"
            :disabled="!canChangeTodo"
            :id="`todo-${todo.id}`"
          />
          <label :for="`todo-${todo.id}`" class="check-label" :title="canChangeTodo ? 'Đánh dấu hoàn thành' : ''"></label>
        </div>

        <!-- Content -->
        <div class="item-content">
          <span class="todo-text" :class="{ crossed: todo.completed }">{{ todo.text }}</span>
          <div class="item-badges">
            <span v-if="todo.important" class="badge badge-important">⭐ Quan trọng</span>
            <span v-if="todo.completed" class="badge badge-done">✅ Xong</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="item-actions">
          <router-link
            v-if="permissionStore.currentPermission.canViewDetail"
            :to="`/todo/${todo.id}`"
            class="btn-action btn-view"
            title="Xem chi tiết"
          >👁</router-link>

          <button
            v-if="canChangeTodo"
            @click="startEdit(todo)"
            class="btn-action btn-edit"
            title="Chỉnh sửa"
          >✏️</button>

          <button
            v-if="canDeleteTodo"
            @click="store.removeTodo(todo.id)"
            class="btn-action btn-delete"
            title="Xóa"
          >🗑</button>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.todo-container {
  max-width: 720px;
  margin: 0 auto;
}

/* === Page header === */
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px dashed rgba(244, 143, 177, 0.4);
}

.page-icon {
  font-size: 2.4rem;
  filter: drop-shadow(0 4px 8px rgba(233, 30, 140, 0.2));
}

.page-title {
  font-family: 'Dancing Script', cursive;
  font-size: 1.8rem;
  font-weight: 700;
  color: #c2185b;
  margin: 0;
}

.page-count {
  font-size: 13px;
  color: #b5547a;
  font-weight: 600;
  margin-top: 2px;
}

/* === Add section === */
.add-section {
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.85);
  border: 2px solid rgba(244, 143, 177, 0.5);
  border-radius: 14px;
  padding: 0 16px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(233, 30, 140, 0.06);
}

.input-wrapper:focus-within {
  border-color: #e91e8c;
  box-shadow: 0 4px 20px rgba(233, 30, 140, 0.15);
  background: white;
}

.input-prefix { font-size: 16px; opacity: 0.7; }

.todo-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 14px 0;
  font-size: 14px;
  color: #6d3b47;
  font-family: 'Nunito', sans-serif;
}

.todo-input::placeholder { color: #d4a0b0; }
.todo-input:focus { outline: none; }

.btn-add {
  padding: 12px 22px;
  background: linear-gradient(135deg, #ff6b9d, #e91e8c);
  color: white;
  border: none;
  border-radius: 14px;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 6px 16px rgba(233, 30, 140, 0.3);
  transition: all 0.3s;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(233, 30, 140, 0.4);
}

.btn-add:active { transform: translateY(0); }

.locked-state {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.7);
  border: 1.5px dashed #f48fb1;
  border-radius: 14px;
  color: #a0607a;
  font-size: 13px;
  font-weight: 600;
}

/* === Empty state === */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon { font-size: 3.5rem; margin-bottom: 16px; opacity: 0.7; }
.empty-title {
  font-family: 'Dancing Script', cursive;
  font-size: 1.5rem;
  color: #c2185b;
  margin-bottom: 8px;
}
.empty-sub { color: #b5547a; font-size: 14px; }

/* === Todo list === */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.82);
  border: 1.5px solid rgba(244, 143, 177, 0.35);
  border-radius: 16px;
  padding: 14px 16px;
  transition: all 0.25s;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 10px rgba(233, 30, 140, 0.04);
}

.todo-item:hover {
  box-shadow: 0 6px 24px rgba(233, 30, 140, 0.12);
  border-color: rgba(244, 143, 177, 0.6);
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.95);
}

.todo-item.done {
  background: rgba(250, 245, 255, 0.7);
  border-color: rgba(200, 230, 200, 0.5);
}

/* Custom checkbox */
.item-check { position: relative; flex-shrink: 0; }

.checkbox {
  position: absolute;
  opacity: 0;
  width: 22px;
  height: 22px;
  cursor: pointer;
  z-index: 1;
  margin: 0;
}

.checkbox:disabled { cursor: not-allowed; }

.check-label {
  display: block;
  width: 22px;
  height: 22px;
  border: 2px solid #f48fb1;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.checkbox:checked + .check-label {
  background: linear-gradient(135deg, #ff6b9d, #e91e8c);
  border-color: #e91e8c;
}

.checkbox:checked + .check-label::after {
  content: '✓';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  font-weight: 700;
}

.checkbox:disabled + .check-label { cursor: not-allowed; opacity: 0.7; }

/* Content */
.item-content {
  flex: 1;
  min-width: 0;
}

.todo-text {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #6d3b47;
  word-break: break-word;
  transition: all 0.3s;
  line-height: 1.5;
}

.todo-text.crossed {
  text-decoration: line-through;
  color: #c4a0b0;
}

.item-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 5px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.badge-important {
  background: linear-gradient(135deg, #fff4d6, #ffeaa0);
  color: #8a5b00;
  border: 1px solid rgba(200, 160, 0, 0.2);
}

.badge-done {
  background: linear-gradient(135deg, #d4f5d4, #b8f0b8);
  color: #2a6e2a;
  border: 1px solid rgba(0, 160, 0, 0.15);
}

/* Actions */
.item-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.btn-action {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.8);
  border: 1.5px solid rgba(244, 143, 177, 0.3);
}

.btn-action:hover { transform: scale(1.1); }

.btn-view:hover { background: rgba(33, 150, 243, 0.1); border-color: #64b5f6; }
.btn-edit:hover { background: rgba(255, 193, 7, 0.15); border-color: #ffc107; }
.btn-delete:hover { background: rgba(244, 67, 54, 0.1); border-color: #ef9a9a; }

/* === Modal === */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(109, 59, 71, 0.3);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 480px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.97), rgba(255, 240, 248, 0.97));
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 30px 70px rgba(109, 59, 71, 0.2);
  border: 1.5px solid rgba(244, 143, 177, 0.4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-icon { font-size: 1.4rem; }

.modal-header h3 {
  margin: 0;
  font-family: 'Dancing Script', cursive;
  font-size: 1.4rem;
  color: #c2185b;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(244, 143, 177, 0.15);
  border-radius: 8px;
  cursor: pointer;
  color: #c2185b;
  font-size: 14px;
  font-weight: 700;
  transition: background 0.2s;
}

.modal-close:hover { background: rgba(233, 30, 140, 0.15); }

.form-field {
  margin-bottom: 18px;
}

.form-field label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #b5547a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.form-field .input-wrapper {
  border-radius: 12px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(255, 240, 248, 0.8);
  border: 1.5px solid #f48fb1;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #b5547a;
}

.status-badge.done {
  background: rgba(200, 240, 200, 0.5);
  border-color: #81c784;
  color: #2a6e2a;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-save {
  padding: 11px 24px;
  background: linear-gradient(135deg, #ff6b9d, #e91e8c);
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(233, 30, 140, 0.3);
  transition: all 0.3s;
}

.btn-save:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(233, 30, 140, 0.4); }

.btn-cancel {
  padding: 11px 20px;
  background: rgba(255, 255, 255, 0.8);
  color: #9c4468;
  border: 1.5px solid rgba(244, 143, 177, 0.5);
  border-radius: 12px;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover { background: rgba(244, 143, 177, 0.1); }

/* === Transitions === */
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.9); }

.list-enter-active, .list-leave-active { transition: all 0.35s ease; }
.list-enter-from { opacity: 0; transform: translateX(-20px); }
.list-leave-to { opacity: 0; transform: translateX(20px); }
.list-move { transition: transform 0.35s ease; }
</style>
