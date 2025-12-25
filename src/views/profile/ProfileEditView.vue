<template>
  <main class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </button>
        <h1 class="text-3xl font-bold text-gray-900">Edit Profile</h1>
        <p class="text-gray-600 mt-2">Update your personal information</p>
      </div>

      <div v-if="isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-gray-500 mt-4">Loading profile...</p>
      </div>

      <div v-else-if="errorMessage" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-600 font-medium">{{ errorMessage }}</p>
      </div>

      <div v-else class="bg-white rounded-lg shadow-sm">
        <!-- Tabs -->
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              @click="activeTab = 'account'"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'account'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Account Information
            </button>
            <button
              @click="activeTab = 'password'"
              :class="[
                'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'password'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Password & Security
            </button>
          </nav>
        </div>

        <!-- Account Information Tab -->
        <div v-show="activeTab === 'account'" class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Personal Data</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Full Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="Enter your full name"
              />
              <p class="text-xs text-gray-500 mt-1">Your full name will also appear as your profile name</p>
            </div>

            <!-- Username (Read-only) -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                disabled
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                placeholder="Enter your username"
              />
              <p class="text-xs text-gray-500 mt-1">Username cannot be changed</p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  required
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <!-- Gender -->
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                v-model="formData.gender"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow appearance-none bg-white"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <!-- Role (Read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div class="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" :class="roleBadgeClass">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {{ userRoleName }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">Account type cannot be changed</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="goBack"
                class="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Password & Security Tab -->
        <div v-show="activeTab === 'password'" class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
          
          <form @submit.prevent="handlePasswordChange" class="space-y-6">
            <!-- Current Password -->
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="Enter current password"
              />
            </div>

            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="Enter new password"
              />
              <p class="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
            </div>

            <!-- Confirm New Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="Confirm new password"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="resetPasswordForm"
                class="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSaving ? 'Updating...' : 'Update Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-up"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ successMessage }}</span>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth.store'
import { userService } from '@/services/user.service'
import type { User, Customer, UpdateUserRequest } from '@/interfaces/user.interface'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref<'account' | 'password'>('account')
const isLoading = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const userInfo = ref<User | Customer | null>(null)

const formData = ref({
  name: '',
  username: '',
  email: '',
  gender: '' as 'MALE' | 'FEMALE' | 'OTHER' | ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const currentUser = computed(() => authStore.currentUserInfo)

const userRoleName = computed(() => {
  const role = userInfo.value?.role
  if (role === 'SUPERADMIN') return 'Superadmin'
  if (role === 'ACCOMMODATION_OWNER') return 'Accommodation Owner'
  if (role === 'CUSTOMER') return 'Customer'
  return role || 'Guest'
})

const roleBadgeClass = computed(() => {
  const role = userInfo.value?.role
  if (role === 'SUPERADMIN') return 'bg-purple-100 text-purple-700 border border-purple-200'
  if (role === 'ACCOMMODATION_OWNER') return 'bg-blue-100 text-blue-700 border border-blue-200'
  if (role === 'CUSTOMER') return 'bg-green-100 text-green-700 border border-green-200'
  return 'bg-gray-100 text-gray-700 border border-gray-200'
})

const fetchProfile = async () => {
  if (!currentUser.value?.username) {
    errorMessage.value = 'User information not available. Please login again.'
    return
  }
  
  try {
    isLoading.value = true
    errorMessage.value = ''
    const data = await userService.getUserByIdentifier(currentUser.value.username)
    userInfo.value = data
    
    // Populate form
    formData.value = {
      name: data.name,
      username: data.username,
      email: data.email,
      gender: data.gender || ''
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to load profile data'
    console.error('Error fetching profile:', err)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!userInfo.value?.id) return
  
  try {
    isSaving.value = true
    errorMessage.value = ''
    
    const updateData: UpdateUserRequest = {
      name: formData.value.name,
      email: formData.value.email,
      gender: formData.value.gender || undefined
    }
    
    await userService.updateUser(userInfo.value.id, updateData)
    
    // Update auth store
    await authStore.refreshUserInfo()
    
    successMessage.value = 'Profile updated successfully!'
    setTimeout(() => {
      successMessage.value = ''
      router.push('/profile')
    }, 2000)
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to update profile'
    console.error('Error updating profile:', err)
  } finally {
    isSaving.value = false
  }
}

const handlePasswordChange = async () => {
  if (!userInfo.value?.id) return
  
  // Validate password
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    errorMessage.value = 'Please fill in all password fields'
    return
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errorMessage.value = 'New passwords do not match'
    return
  }
  
  if (passwordForm.value.newPassword.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters'
    return
  }
  
  try {
    isSaving.value = true
    errorMessage.value = ''
    
    const updateData: UpdateUserRequest = {
      password: passwordForm.value.newPassword
    }
    
    await userService.updateUser(userInfo.value.id, updateData)
    
    successMessage.value = 'Password updated successfully!'
    resetPasswordForm()
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to update password'
    console.error('Error updating password:', err)
  } finally {
    isSaving.value = false
  }
}

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const goBack = () => {
  router.push('/profile')
}

onMounted(async () => {
  await fetchProfile()
})
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
