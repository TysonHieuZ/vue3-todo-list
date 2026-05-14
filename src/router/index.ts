// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import TodoList from '../views/TodoList.vue';

const routes = [
  {
    path: '/',
    redirect: '/todos/all'
  },
  {
    path: '/todos/:filter?',
    name: 'todos',
    component: TodoList,
    props: true
  },
  {
    path: '/todo/:id',
    name: 'detail',
    // Lazy loading: chỉ tải trang detail khi người dùng nhấn vào
    component: () => import('../views/TodoDetail.vue') 
  }
];

export const router = createRouter({
  history: createWebHistory(), // Quản lý lịch sử trình duyệt
  routes: routes               // Truyền danh sách các trang vào đây
});