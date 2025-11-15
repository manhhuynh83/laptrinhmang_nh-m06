// src/router/guards.js
import { useAuthStore } from '../store/auth';

/**
 * Auth guard - Yêu cầu đăng nhập
 */
export const authGuard = (to, from, next) => {
  const authStore = useAuthStore();
  
  if (!authStore.isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
};

/**
 * Guest guard - Chỉ cho phép người chưa đăng nhập
 */
export const guestGuard = (to, from, next) => {
  const authStore = useAuthStore();
  
  if (authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
};

/**
 * Admin guard - Yêu cầu role admin
 */
export const adminGuard = (to, from, next) => {
  const authStore = useAuthStore();
  
  if (!authStore.isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else if (authStore.user?.role !== 'admin') {
    next('/403'); // Forbidden
  } else {
    next();
  }
};