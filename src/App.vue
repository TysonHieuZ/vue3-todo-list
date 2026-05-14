<script setup lang="ts">
import { reactive } from 'vue';

// Định nghĩa cấu trúc menu
interface MenuItem {
  title: string;
  path?: string;
  isOpen?: boolean;
  children?: MenuItem[];
}

// Khởi tạo trạng thái menu
const menuItems = reactive<MenuItem[]>([
  { title: 'Trang chủ', path: '/todos/all' },
  { 
    title: 'Quản lý To-do', 
    isOpen: true,
    children: [
      { title: 'Tất cả công việc', path: '/todos/all' },
      { title: 'Việc quan trọng', path: '/todos/important' },
      { title: 'Công việc đã hoàn thành', path: '/todos/completed' },
      { title: 'Công việc chưa hoàn thành', path: '/todos/pending' },
    ]
  },
]);
</script>

<template>
  <div class="layout">
    <!-- PHẦN 1: SIDEBAR (MENU THỨ CẤP) -->
    <aside class="sidebar">
      <div v-for="item in menuItems" :key="item.title" class="menu-group">
        <!-- Nếu có menu con -->
        <div v-if="item.children">
          <div @click="item.isOpen = !item.isOpen" class="menu-parent">
            {{ item.title }} <span>{{ item.isOpen ? '−' : '+' }}</span>
          </div>
          <ul v-if="item.isOpen" class="sub-menu">
            <li v-for="sub in item.children" :key="sub.title">
              <router-link :to="sub.path || '/'">{{ sub.title }}</router-link>
            </li>
          </ul>
        </div>
        
        <!-- Nếu là menu đơn -->
        <router-link v-else :to="item.path || '/'" class="menu-single">
          {{ item.title }}
        </router-link>
      </div>
    </aside>

    <!-- PHẦN 2: NỘI DUNG CHÍNH (THAY ĐỔI THEO ROUTER) -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}

.sidebar {
  width: 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
}

.menu-group {
  margin-bottom: 5px;
}

.menu-parent {
  cursor: pointer;
  padding: 15px 20px;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  transition: all 0.3s;
  border-left: 4px solid transparent;
}

.menu-parent:hover {
  background: rgba(255, 255, 255, 0.1);
  border-left-color: #ffc107;
}

.sub-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgba(0, 0, 0, 0.1);
}

.sub-menu li {
  margin: 0;
}

.sub-menu a {
  display: block;
  padding: 12px 20px;
  padding-left: 40px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.sub-menu a:hover,
.sub-menu a.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  border-left-color: #ffc107;
  padding-left: 45px;
}

.menu-single {
  display: block;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
  border-left: 4px solid transparent;
}

.menu-single:hover,
.menu-single.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  border-left-color: #ffc107;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f5f5f5;
  overflow-y: auto;
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>