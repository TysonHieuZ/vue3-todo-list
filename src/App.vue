<script setup lang="ts">
import { reactive } from 'vue';
import { usePermissionStore } from './stores/permissionStore';
import type { PermissionKey } from './stores/permissionStore';

interface MenuItem {
  title: string;
  path?: string;
  isOpen?: boolean;
  children?: MenuItem[];
}

const permissionStore = usePermissionStore();

const handlePermissionChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  permissionStore.setPermission(target.value as PermissionKey);
};

const menuItems = reactive<MenuItem[]>([
  { title: 'Trang chủ', path: '/todos/all' },
  {
    title: 'Quản lý To-do',
    isOpen: true,
    children: [
      { title: 'Tất cả công việc', path: '/todos/all' },
      { title: 'Việc quan trọng', path: '/todos/important' },
      {
        title: 'Theo trạng thái',
        isOpen: true,
        children: [
          { title: 'Công việc đã hoàn thành', path: '/todos/completed' },
          { title: 'Công việc chưa hoàn thành', path: '/todos/pending' }
        ]
      }
    ]
  }
]);
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="permission-box">
        <label for="permissionKey">Quyền hiện tại</label>
        <select
          id="permissionKey"
          :value="permissionStore.currentKey"
          @change="handlePermissionChange"
        >
          <option
            v-for="option in permissionStore.permissionOptions"
            :key="option.key"
            :value="option.key"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div v-for="item in menuItems" :key="item.title" class="menu-group">
        <div v-if="item.children">
          <button type="button" @click="item.isOpen = !item.isOpen" class="menu-parent">
            <span>{{ item.title }}</span>
            <span>{{ item.isOpen ? '-' : '+' }}</span>
          </button>

          <ul v-if="item.isOpen" class="sub-menu">
            <li v-for="sub in item.children" :key="sub.title">
              <template v-if="sub.children">
                <button type="button" @click="sub.isOpen = !sub.isOpen" class="sub-menu-parent">
                  <span>{{ sub.title }}</span>
                  <span>{{ sub.isOpen ? '-' : '+' }}</span>
                </button>
                <ul v-if="sub.isOpen" class="nested-sub-menu">
                  <li v-for="child in sub.children" :key="child.title">
                    <router-link :to="child.path || '/'">{{ child.title }}</router-link>
                  </li>
                </ul>
              </template>

              <router-link v-else :to="sub.path || '/'">{{ sub.title }}</router-link>
            </li>
          </ul>
        </div>

        <router-link v-else :to="item.path || '/'" class="menu-single">
          {{ item.title }}
        </router-link>
      </div>
    </aside>

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
  width: 270px;
  background: #25324a;
  padding: 20px 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
}

.permission-box {
  margin: 0 16px 20px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
}

.permission-box label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
}

.permission-box select {
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  background: #ffffff;
  color: #25324a;
  font-weight: 700;
}

.menu-group {
  margin-bottom: 5px;
}

.menu-parent,
.sub-menu-parent {
  width: 100%;
  border: none;
  cursor: pointer;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  transition: all 0.3s;
  border-left: 4px solid transparent;
  background: transparent;
  text-align: left;
}

.menu-parent {
  padding: 15px 20px;
  font-weight: bold;
}

.sub-menu-parent {
  padding: 12px 20px 12px 40px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
}

.menu-parent:hover,
.sub-menu-parent:hover {
  background: rgba(255, 255, 255, 0.1);
  border-left-color: #ffc107;
}

.sub-menu,
.nested-sub-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgba(0, 0, 0, 0.12);
}

.nested-sub-menu {
  background: rgba(0, 0, 0, 0.16);
}

.sub-menu li,
.nested-sub-menu li {
  margin: 0;
}

.sub-menu a,
.nested-sub-menu a {
  display: block;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.sub-menu a {
  padding-left: 40px;
}

.nested-sub-menu a {
  padding-left: 58px;
}

.sub-menu a:hover,
.sub-menu a.router-link-active,
.nested-sub-menu a:hover,
.nested-sub-menu a.router-link-active {
  background: rgba(255, 255, 255, 0.16);
  border-left-color: #ffc107;
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
