<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePermissionStore } from '../stores/permissionStore';
import { useTodoStore } from '../stores/todoStore';

const route = useRoute();
const store = useTodoStore();
const permissionStore = usePermissionStore();

const todo = computed(() => store.todoList.find((item) => item.id === Number(route.params.id)) || null);
</script>

<template>
  <div class="detail-container">
    <div v-if="permissionStore.currentPermission.canViewDetail">
      <div v-if="todo" class="detail-card">
        <div class="detail-header">
          <h1>Chi tiết công việc</h1>
          <router-link to="/" class="btn-back">Quay lại</router-link>
        </div>

        <div class="detail-content">
          <div class="detail-row">
            <span class="detail-label">Tiêu đề:</span>
            <span class="detail-value">{{ todo.text }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">ID:</span>
            <span class="detail-value">#{{ todo.id }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Trạng thái:</span>
            <span class="detail-value" :class="{ completed: todo.completed }">
              {{ todo.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành' }}
            </span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Phân loại:</span>
            <span class="detail-value" :class="{ important: todo.important }">
              {{ todo.important ? 'Quan trọng' : 'Thông thường' }}
            </span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Ngày tạo:</span>
            <span class="detail-value">{{ new Date(todo.id).toLocaleString('vi-VN') }}</span>
          </div>
        </div>
      </div>

      <div v-else class="not-found">
        <p>Không tìm thấy công việc này</p>
        <router-link to="/" class="btn-back">Quay lại danh sách</router-link>
      </div>
    </div>

    <div v-else class="not-found">
      <p>Quyền hiện tại không được xem chi tiết công việc.</p>
      <router-link to="/" class="btn-back">Quay lại danh sách</router-link>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.detail-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.detail-header h1 {
  color: #333;
  margin: 0;
  font-size: 24px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
}

.detail-label {
  font-weight: bold;
  color: #555;
  min-width: 120px;
}

.detail-value {
  color: #333;
  word-break: break-word;
  flex: 1;
  margin-left: 15px;
}

.detail-value.completed {
  color: #4caf50;
  font-weight: bold;
}

.detail-value.important {
  color: #8a5b00;
  font-weight: bold;
}

.btn-back {
  padding: 10px 20px;
  background: #2196f3;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s;
  font-weight: 600;
  white-space: nowrap;
}

.btn-back:hover {
  background: #0b7dda;
}

.not-found {
  text-align: center;
  padding: 60px 20px;
}

.not-found p {
  font-size: 18px;
  color: #777;
  margin-bottom: 20px;
}
</style>
