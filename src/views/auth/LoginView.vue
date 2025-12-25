<script setup lang="ts">
import type { LoginRequest } from '@/interfaces/user.interface'
import { useAuthStore } from '@/stores/auth/auth.store'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const loginData = ref<LoginRequest>({
  identifier: '',
  password: '',
})

const handleLogin = async () => {
  await authStore.login(loginData.value)

  if (!authStore.error) {
    router.push('/')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo and Welcome -->
      <div class="text-center mb-8">
        <h1 class="text-5xl font-bold text-blue-600 mb-2">TravelAPAP</h1>
        <p class="text-gray-600">Welcome back! Please login to your account</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email/Username Input -->
          <div>
            <label for="identifier" class="block text-sm font-semibold text-gray-700 mb-2">
              Email or Username
            </label>
            <input
              id="identifier"
              v-model="loginData.identifier"
              type="text"
              required
              placeholder="Enter your email or username"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="loginData.password"
              type="password"
              required
              placeholder="Enter your password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg transform transition-all hover:scale-[1.02]"
          >
            <span v-if="authStore.loading">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
            <span v-else>Login</span>
          </button>

          <!-- Register Link -->
          <div class="text-center pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <RouterLink 
                to="/register" 
                class="text-blue-600 hover:text-blue-700 font-semibold hover:underline ml-1"
              >
                Register here
              </RouterLink>
            </p>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-gray-500 mt-6">
        © 2025 TravelAPAP. Your trusted travel partner.
      </p>
    </div>
  </div>
</template>