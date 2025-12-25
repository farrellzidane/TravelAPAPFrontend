<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user/user.store'
import { useAuthStore } from '@/stores/auth/auth.store'
import type { UpdateUserRequest } from '@/interfaces/user.interface'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const userId = computed(() => route.params.id as string)
const loading = ref(false)

const formData = ref<UpdateUserRequest>({
  name: '',
  email: '',
  password: '',
  gender: undefined,
  role: undefined,
})

const canChangeRole = computed(() => {
  return authStore.currentUserInfo?.role === 'SUPERADMIN'
})

const handleSubmit = async () => {
  loading.value = true
  try {
    // Remove empty fields
    const updateData: UpdateUserRequest = {}
    if (formData.value.name) updateData.name = formData.value.name
    if (formData.value.email) updateData.email = formData.value.email
    if (formData.value.password) updateData.password = formData.value.password
    if (formData.value.gender) updateData.gender = formData.value.gender
    if (formData.value.role && canChangeRole.value) updateData.role = formData.value.role

    await userStore.updateUser(userId.value, updateData)
    toast.success('User updated successfully')
    router.push(`/users/${userId.value}`)
  } catch (error: any) {
    toast.error(error.message || 'Update failed')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push(`/users/${userId.value}`)
}

onMounted(async () => {
  if (userId.value) {
    await userStore.fetchUserByIdentifier(userId.value)
    const user = userStore.currentUser
    if (user) {
      formData.value = {
        name: user.name,
        email: user.email,
        password: '',
        gender: user.gender,
        role: user.role,
      }
    }
  }
})
</script>

<template>
  <main class="w-full min-h-screen pt-24 py-10 px-4">
    <div class="mx-auto w-full max-w-2xl">
      <div class="bg-white shadow-lg rounded-2xl p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Edit User</h1>

        <div v-if="userStore.loading && !userStore.currentUser" class="text-center py-10">
          <p class="text-gray-500">Loading user data...</p>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              New Password (leave blank to keep current)
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              minlength="8"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
          </div>

          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              id="gender"
              v-model="formData.gender"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender...</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div v-if="canChangeRole">
            <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
              Role (SUPERADMIN only)
            </label>
            <select
              id="role"
              v-model="formData.role"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ACCOMMODATION_OWNER">Accommodation Owner</option>
              <option value="SUPERADMIN">Superadmin</option>
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="handleCancel"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
