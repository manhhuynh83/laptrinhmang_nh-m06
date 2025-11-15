<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 to-pink-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-amber-100">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
          <span class="text-white font-bold text-2xl">Q</span>
        </div>
        <h1 class="text-2xl font-bold text-amber-900">Đăng ký tài khoản</h1>
        <p class="text-amber-600 mt-2">Tạo tài khoản mới để bắt đầu sử dụng dịch vụ.</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-amber-700 mb-2">Họ và tên</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-amber-50/50"
            placeholder="Nhập họ và tên"
            required
            :disabled="isLoading"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-amber-700 mb-2">E-mail</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-amber-50/50"
            placeholder="Nhập địa chỉ email"
            required
            :disabled="isLoading"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-amber-700 mb-2">Mật khẩu</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-amber-50/50"
            placeholder="Nhập mật khẩu"
            required
            :disabled="isLoading"
          />
        </div>

        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-amber-700 mb-2">Xác nhận mật khẩu</label>
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            class="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-amber-50/50"
            placeholder="Nhập lại mật khẩu"
            required
            :disabled="isLoading"
          />
        </div>

        <div v-if="error" class="bg-rose-50 border border-rose-200 rounded-lg p-4">
          <p class="text-rose-800 text-sm">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký' }}
        </button>

        <div class="text-center">
          <p class="text-amber-600">
            Đã có tài khoản?
            <router-link to="/login" class="text-amber-700 hover:text-amber-800 font-medium ml-1 underline">
              Đăng nhập ngay
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js';

const router = useRouter();
const { register, isLoading, error } = useAuth();

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const handleRegister = async () => {
  try {
    await register(form.value);
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    router.push('/login');
  } catch (err) {
    console.error('Registration failed:', err);
  }
};
</script>