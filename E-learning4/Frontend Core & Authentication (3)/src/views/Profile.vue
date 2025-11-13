<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">Q</span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">QuickPlay</h1>
              <p class="text-sm text-gray-500">Platform Demo</p>
            </div>
          </div>
          
          <nav class="flex items-center space-x-4">
            <router-link to="/" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Trang chủ
            </router-link>
            <router-link to="/profile" class="text-blue-600 font-medium px-3 py-2 rounded-lg bg-blue-50">
              Hồ sơ
            </router-link>
            <button 
              @click="handleLogout" 
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Đăng xuất
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">👤 Thông tin cá nhân</h1>
        
        <div class="space-y-6">
          <div class="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <p class="text-sm font-medium text-gray-500">Họ và tên</p>
              <p class="text-lg text-gray-900">{{ user?.name || 'Chưa cập nhật' }}</p>
            </div>
            <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Chỉnh sửa
            </button>
          </div>
          
          <div class="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <p class="text-sm font-medium text-gray-500">Email</p>
              <p class="text-lg text-gray-900">{{ user?.email || 'Chưa cập nhật' }}</p>
            </div>
            <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Chỉnh sửa
            </button>
          </div>
          
          <div class="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <p class="text-sm font-medium text-gray-500">Ngày tham gia</p>
              <p class="text-lg text-gray-900">{{ formatDate(user?.created_at) }}</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Vai trò</p>
              <p class="text-lg text-gray-900">Thành viên</p>
            </div>
            <span class="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js';

const router = useRouter();
const { user, logout, isLoading, fetchProfile } = useAuth();

const handleLogout = async () => {
  await logout();
  router.push('/login');
};

const formatDate = (dateString) => {
  if (!dateString) return 'Chưa cập nhật';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(async () => {
  await fetchProfile();
});
</script>