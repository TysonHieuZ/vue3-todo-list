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
    component: () => import('../views/TodoDetail.vue')
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
