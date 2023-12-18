import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../components/Dashboard.vue';
import Expenses from '../components/Expenses.vue';
import Incomes from '../components/Incomes.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: Expenses,
  },
  {
    path: '/incomes',
    name: 'Incomes',
    component: Incomes,
  },
  // Other routes if needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
