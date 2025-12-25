<script setup lang="ts">
import { onMounted, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user/user.store'
import VDataTable from '@/components/common/VDataTable.vue'
import type { User } from '@/interfaces/user.interface'
import type { ColumnDef } from '@tanstack/vue-table'

const router = useRouter()
const userStore = useUserStore()

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role
      const classes = {
        'SUPERADMIN': 'bg-purple-100 text-purple-800',
        'ACCOMMODATION_OWNER': 'bg-blue-100 text-blue-800',
        'CUSTOMER': 'bg-green-100 text-green-800',
      }
      return h('span', { class: `px-2 py-1 text-xs rounded-full ${classes[role]}` }, role)
    }
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => row.original.gender || 'N/A'
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => formatDate(row.original.createdAt)
  },
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const handleRowClick = (user: User) => {
  router.push(`/users/${user.id}`)
}

onMounted(async () => {
  await userStore.fetchAllUsers()
})
</script>

<template>
  <main class="w-full min-h-screen pt-24 py-10 px-4">
    <div class="mx-auto w-full max-w-7xl">
      <div class="bg-white shadow-lg rounded-2xl p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <p class="text-sm text-gray-500">Total: {{ userStore.users.length }} users</p>
        </div>

        <div v-if="userStore.loading" class="text-center py-10">
          <p class="text-gray-500">Loading users...</p>
        </div>

        <div v-else-if="userStore.error" class="text-center py-10">
          <p class="text-red-500">{{ userStore.error }}</p>
          <button
            @click="userStore.fetchAllUsers"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>

        <div v-else>
          <VDataTable :columns="columns" :data="userStore.users" @row-click="handleRowClick" />
        </div>
      </div>
    </div>
  </main>
</template>
