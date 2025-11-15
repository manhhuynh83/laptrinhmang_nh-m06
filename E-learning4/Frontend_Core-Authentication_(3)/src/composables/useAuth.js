import { computed } from 'vue';
import { useAuthStore } from '../store/auth';
import router from '../router';

export function useAuth() {
  const auth = useAuthStore();

  const user = computed(() => auth.user);
  const isAuthenticated = computed(() => auth.isAuthenticated);
  const loading = computed(() => auth.loading);

  async function login(payload) {
    await auth.login(payload);
    const redirect = router.currentRoute.value.query.redirect || '/';
    await router.push(redirect);
  }

  async function register(payload) {
    await auth.register(payload);
    await router.push('/');
  }

  async function logout() {
    await auth.logout();
    await router.push('/login');
  }

  return { user, isAuthenticated, loading, login, register, logout };
}
