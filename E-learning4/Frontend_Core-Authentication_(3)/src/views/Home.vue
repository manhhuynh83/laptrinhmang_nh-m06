<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 to-pink-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-sm shadow-sm border-b border-amber-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-amber-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
              <span class="text-white font-bold text-lg">Q</span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-amber-900">QuickPlay</h1>
              <p class="text-sm text-amber-600">Platform Demo</p>
            </div>
          </div>
          
          <nav class="flex items-center space-x-4">
            <router-link 
              to="/" 
              class="text-amber-700 bg-amber-100 font-medium px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors"
            >
              🏠 Trang chủ
            </router-link>
            <router-link 
              to="/profile" 
              class="text-amber-600 hover:text-amber-800 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
            >
              👤 Hồ sơ
            </router-link>
            <button 
              @click="handleLogout" 
              class="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              :disabled="isLoading"
            >
              <span>🚪</span>
              <span>{{ isLoading ? '...' : 'Đăng xuất' }}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-amber-400 to-pink-400 rounded-2xl p-8 text-white shadow-lg mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-4">Chào mừng đến với QuickPlay! 🎮</h1>
            <p class="text-xl opacity-90 mb-2">Nền tảng giải trí và kết nối cộng đồng hàng đầu</p>
            <div class="flex items-center space-x-2 text-amber-100">
              <span class="text-lg">👋 Xin chào,</span>
              <span class="font-semibold text-xl">{{ user?.name || 'Thành viên' }}</span>
            </div>
          </div>
          <div class="text-6xl">
            🎯
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Account Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <span class="text-2xl text-amber-600">👤</span>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-amber-600">1</div>
              <div class="text-sm text-amber-500 font-medium">Đang hoạt động</div>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-amber-900 mb-2">Tài khoản</h3>
          <p class="text-amber-700 text-sm">Tài khoản của bạn đang hoạt động bình thường</p>
        </div>

        <!-- Posts Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <span class="text-2xl text-pink-600">📝</span>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-pink-600">0</div>
              <div class="text-sm text-pink-500 font-medium">Chưa có</div>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-pink-900 mb-2">Bài viết</h3>
          <p class="text-pink-700 text-sm">Bạn chưa tạo bài viết nào</p>
        </div>

        <!-- Status Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span class="text-2xl text-purple-600">✅</span>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-purple-600">100%</div>
              <div class="text-sm text-purple-500 font-medium">Tốt</div>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-purple-900 mb-2">Trạng thái</h3>
          <p class="text-purple-700 text-sm">Tài khoản đã xác thực và sẵn sàng</p>
        </div>
      </div>

      <!-- Quick Actions & Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Quick Actions -->
        <div class="bg-white rounded-2xl shadow-sm border border-amber-100 p-6">
          <h2 class="text-xl font-bold text-amber-900 mb-4 flex items-center">
            <span class="mr-2">🚀</span>
            Bắt đầu ngay
          </h2>
          <div class="space-y-3">
            <div class="flex items-center space-x-3 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
              <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <p class="font-medium text-amber-900">Cập nhật hồ sơ</p>
                <p class="text-sm text-amber-700">Hoàn thiện thông tin cá nhân</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors">
              <div class="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <p class="font-medium text-pink-900">Khám phá tính năng</p>
                <p class="text-sm text-pink-700">Tìm hiểu các công cụ có sẵn</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
              <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <p class="font-medium text-purple-900">Mời bạn bè</p>
                <p class="text-sm text-purple-700">Chia sẻ trải nghiệm cùng người thân</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
          <h2 class="text-xl font-bold text-pink-900 mb-4 flex items-center">
            <span class="mr-2">📊</span>
            Hoạt động gần đây
          </h2>
          <div class="space-y-4">
            <div class="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span class="text-green-600 text-lg">✓</span>
              </div>
              <div>
                <p class="font-medium text-amber-900">Đăng nhập thành công</p>
                <p class="text-sm text-amber-700">Vừa xong</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-blue-600 text-lg">👋</span>
              </div>
              <div>
                <p class="font-medium text-pink-900">Chào mừng đến QuickPlay</p>
                <p class="text-sm text-pink-700">Hôm nay</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span class="text-purple-600 text-lg">⭐</span>
              </div>
              <div>
                <p class="font-medium text-purple-900">Tài khoản đã kích hoạt</p>
                <p class="text-sm text-purple-700">Sẵn sàng sử dụng</p>
              </div>
            </div>
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

onMounted(async () => {
  await fetchProfile();
});
</script>