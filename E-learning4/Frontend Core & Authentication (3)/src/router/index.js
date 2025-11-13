import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login, meta: { guest: true } },
  { path: '/register', name: 'register', component: Register, meta: { guest: true } },
  { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  if (auth.token && !auth.user) {
    try {
      await auth.fetchMe();
    } catch (e) {}
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath }});
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return next({ name: 'home' });
  }

  next();
});

export default router;
