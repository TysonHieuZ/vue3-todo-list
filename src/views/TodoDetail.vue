<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePermissionStore } from '../stores/permissionStore';
import { useTodoStore } from '../stores/todoStore';

const route = useRoute();
const store = useTodoStore();
const permissionStore = usePermissionStore();

const todo = computed(
  () => store.todoList.find((item) => item.id === Number(route.params.id)) || null
);
</script>

<template>
  <div class="detail-container">
    <!-- Has permission -->
    <div v-if="permissionStore.currentPermission.canViewDetail">
      <!-- Found todo -->
      <div v-if="todo" class="detail-card">
        <div class="detail-header">
          <div class="detail-icon-wrap">
            <span class="detail-icon">{{ todo.important ? '⭐' : '📋' }}</span>
          </div>
          <div>
            <h1>Chi tiết công việc</h1>
            <p class="detail-sub">#{{ todo.id }}</p>
          </div>
          <router-link to="/" class="btn-back">← Quay lại</router-link>
        </div>

        <div class="detail-body">
          <div class="detail-row">
            <span class="detail-label">📝 Nội dung</span>
            <span class="detail-value title-value">{{ todo.text }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">🏷 Trạng thái</span>
            <span class="detail-value">
              <span class="status-chip" :class="{ done: todo.completed }">
                {{ todo.completed ? '✅ Đã hoàn thành' : '🔄 Chưa hoàn thành' }}
              </span>
            </span>
          </div>

          <div class="detail-row">
            <span class="detail-label">⭐ Phân loại</span>
            <span class="detail-value">
              <span class="type-chip" :class="{ important: todo.important }">
                {{ todo.important ? '⭐ Quan trọng' : '📌 Thông thường' }}
              </span>
            </span>
          </div>

          <div class="detail-row">
            <span class="detail-label">📅 Ngày tạo</span>
            <span class="detail-value">{{ new Date(todo.id).toLocaleString('vi-VN') }}</span>
          </div>
        </div>

        <div class="detail-footer">
          <p class="footer-note">💕 Mỗi việc hoàn thành là một niềm vui nhỏ 💕</p>
        </div>
      </div>

      <!-- Not found -->
      <div v-else class="not-found-card">
        <div class="nf-icon">🔍</div>
        <h2>Không tìm thấy</h2>
        <p>Công việc này dường như đã biến mất...</p>
        <router-link to="/" class="btn-back">← Quay lại danh sách</router-link>
      </div>
    </div>

    <!-- No permission -->
    <div v-else class="no-permission-card">
      <div class="np-icon">🔒</div>
      <h2>Không có quyền truy cập</h2>
      <p>Vai trò hiện tại chưa được phép xem chi tiết công việc.</p>
      <router-link to="/" class="btn-back">← Quay lại danh sách</router-link>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 600px;
  margin: 0 auto;
}

/* === Detail card === */
.detail-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 240, 248, 0.92));
  border: 1.5px solid rgba(244, 143, 177, 0.4);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(233, 30, 140, 0.1);
  backdrop-filter: blur(10px);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 28px;
  background: linear-gradient(135deg, rgba(255, 228, 236, 0.8), rgba(255, 245, 220, 0.8));
  border-bottom: 1.5px dashed rgba(244, 143, 177, 0.4);
}

.detail-icon-wrap {
  width: 52px;
  height: 52px;
  background: white;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  box-shadow: 0 4px 14px rgba(233, 30, 140, 0.12);
  flex-shrink: 0;
}

.detail-icon { filter: drop-shadow(0 2px 4px rgba(233, 30, 140, 0.2)); }

.detail-header h1 {
  font-family: 'Dancing Script', cursive;
  font-size: 1.5rem;
  font-weight: 700;
  color: #c2185b;
  margin: 0 0 4px;
}

.detail-sub {
  font-size: 12px;
  color: #b5547a;
  font-weight: 600;
}

.btn-back {
  margin-left: auto;
  padding: 10px 18px;
  background: linear-gradient(135deg, #ff6b9d, #e91e8c);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(233, 30, 140, 0.25);
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(233, 30, 140, 0.35);
  color: white;
}

/* === Body rows === */
.detail-body {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  border: 1px solid rgba(244, 143, 177, 0.2);
  transition: all 0.2s;
}

.detail-row:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(244, 143, 177, 0.4);
}

.detail-label {
  font-size: 13px;
  font-weight: 700;
  color: #b5547a;
  min-width: 140px;
  flex-shrink: 0;
  padding-top: 2px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #6d3b47;
  flex: 1;
  word-break: break-word;
}

.title-value {
  font-size: 15px;
  font-family: 'Dancing Script', cursive;
  font-size: 1.15rem;
  color: #c2185b;
}

.status-chip, .type-chip {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
}

.status-chip {
  background: rgba(255, 180, 200, 0.2);
  color: #a0607a;
  border: 1px solid rgba(244, 143, 177, 0.4);
}

.status-chip.done {
  background: rgba(200, 240, 200, 0.4);
  color: #2a6e2a;
  border-color: rgba(100, 200, 100, 0.3);
}

.type-chip {
  background: rgba(255, 245, 220, 0.6);
  color: #8a6020;
  border: 1px solid rgba(200, 160, 60, 0.25);
}

.type-chip.important {
  background: rgba(255, 250, 180, 0.6);
  color: #8a5b00;
  border-color: rgba(255, 193, 7, 0.35);
}

/* Footer */
.detail-footer {
  padding: 16px 28px;
  background: rgba(255, 228, 236, 0.4);
  border-top: 1px dashed rgba(244, 143, 177, 0.4);
  text-align: center;
}

.footer-note {
  font-family: 'Dancing Script', cursive;
  font-size: 1rem;
  color: #c2185b;
  opacity: 0.8;
}

/* === Not found / No permission cards === */
.not-found-card, .no-permission-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 240, 248, 0.9));
  border: 1.5px solid rgba(244, 143, 177, 0.4);
  border-radius: 22px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(233, 30, 140, 0.08);
}

.nf-icon, .np-icon {
  font-size: 3.5rem;
  display: block;
  margin-bottom: 16px;
  opacity: 0.8;
}

.not-found-card h2, .no-permission-card h2 {
  font-family: 'Dancing Script', cursive;
  font-size: 1.6rem;
  color: #c2185b;
  margin-bottom: 10px;
}

.not-found-card p, .no-permission-card p {
  color: #b5547a;
  font-size: 14px;
  margin-bottom: 24px;
}
</style>
