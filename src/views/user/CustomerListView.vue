<script setup lang="ts">
import { onMounted, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user/user.store'
import VDataTable from '@/components/common/VDataTable.vue'
import type { Customer } from '@/interfaces/user.interface'
import type { ColumnDef } from '@tanstack/vue-table'

const router = useRouter()
const userStore = useUserStore()

const searchQuery = ref('')
const genderFilter = ref('')

const columns: ColumnDef<Customer>[] = [
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
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => row.original.gender || 'N/A'
  },
  {
    accessorKey: 'saldo',
    header: 'Saldo',
    cell: ({ row }) => h('span', { class: 'font-semibold text-green-600' }, formatCurrency(row.original.saldo))
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => formatDate(row.original.createdAt)
  },
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount)
}

const handleSearch = async () => {
  await userStore.fetchAllCustomers(searchQuery.value, genderFilter.value)
}

const handleRowClick = (customer: Customer) => {
  router.push(`/users/${customer.id}`)
}

const clearFilters = async () => {
  searchQuery.value = ''
  genderFilter.value = ''
  await userStore.fetchAllCustomers()
}

onMounted(async () => {
  await userStore.fetchAllCustomers()
})
</script>

<template>
  <main class="w-full min-h-screen pt-24 py-10 px-4">
    <div class="mx-auto w-full max-w-7xl">
      <div class="bg-white shadow-lg rounded-2xl p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Customer List</h1>
          <p class="text-sm text-gray-500">Total: {{ userStore.customers.length }} customers</p>
        </div>

        <!-- Search and Filter -->
        <div class="mb-6 flex gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, email, or username..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="handleSearch"
            />
          </div>
          <div class="w-48">
            <select
              v-model="genderFilter"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <button
            @click="handleSearch"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
          <button
            @click="clearFilters"
            class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Clear
          </button>
        </div>

        <div v-if="userStore.loading" class="text-center py-10">
          <p class="text-gray-500">Loading customers...</p>
        </div>

        <div v-else-if="userStore.error" class="text-center py-10">
          <p class="text-red-500">{{ userStore.error }}</p>
          <button
            @click="() => userStore.fetchAllCustomers()"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>

        <div v-else>
          <VDataTable :columns="columns" :data="userStore.customers" @row-click="handleRowClick" />
        </div>
      </div>
    </div>
  </main>
</template>
