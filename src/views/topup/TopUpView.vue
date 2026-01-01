<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <!-- Header Section -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Top-Up Management</h1>
          <p class="text-gray-600">Manage your top-up transactions</p>
        </div>

        <!-- Action Section -->
        <div class="mb-6">
          <!-- New Top-Up Button - Only for Customer -->
          <button
            v-if="isCustomer"
            @click="goToCreateTopUp"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Top-Up
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="topUpStore.loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Loading top-up transactions...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="topUpStore.error" class="text-center py-12">
          <div class="text-red-500 text-xl mb-4">⚠️</div>
          <p class="text-red-600 mb-2">{{ topUpStore.error }}</p>
          <button
            @click="topUpStore.fetchAllTopUps()"
            class="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Retry
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="topUpStore.topUps.length === 0" class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">💳</div>
          <p class="text-gray-600 text-lg">No top-up transactions found</p>
          <p class="text-gray-500 text-sm mt-2">Start by creating a new top-up transaction</p>
        </div>

        <!-- Top-Ups Table with VDataTable -->
        <div v-else>
          <!-- Status Filter -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Status:</label>
            <select
              v-model="statusFilter"
              class="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <VDataTable :data="filteredTopUps" :columns="columns" :page-size="10" />
        </div>

        <!-- Summary Stats -->
        <div v-if="topUpStore.topUps.length > 0" class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-blue-50 rounded-lg p-4">
            <p class="text-gray-600 text-sm">Total Transactions</p>
            <p class="text-2xl font-bold text-gray-900">{{ topUpStore.totalTopUps }}</p>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4">
            <p class="text-gray-600 text-sm">Pending</p>
            <p class="text-2xl font-bold text-yellow-600">{{ topUpStore.pendingTopUps }}</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <p class="text-gray-600 text-sm">Successful</p>
            <p class="text-2xl font-bold text-green-600">{{ topUpStore.successfulTopUps }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { useTopUpStore } from '@/stores/topup/topup.stores'
import { useAuthStore } from '@/stores/auth/auth.store'
import VDataTable from '@/components/common/VDataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { TopUpTransaction } from '@/interfaces/topup.interface'

const router = useRouter()
const topUpStore = useTopUpStore()
const authStore = useAuthStore()
const statusFilter = ref('')

// Role checking
const isCustomer = computed(() => {
  return authStore.currentUserInfo?.role === 'CUSTOMER'
})

const isSuperAdmin = computed(() => {
  return authStore.currentUserInfo?.role === 'SUPERADMIN'
})



onMounted(async () => {
  await topUpStore.fetchAllTopUps()
})

// Filter top-ups by status
const filteredTopUps = computed(() => {
  if (!statusFilter.value) {
    return topUpStore.topUps
  }
  return topUpStore.topUps.filter(topUp => topUp.status === statusFilter.value)
})

const goToCreateTopUp = () => {
  router.push({ name: 'create-topup' })
}

const goToDetail = (id: string) => {
  router.push({ name: 'topup-detail', params: { id } })
}

const goToUpdateStatus = (id: string) => {
  router.push({ name: 'topup-update-status', params: { id } })
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID').format(amount)
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Invalid Date'
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Define table columns
const columns: ColumnDef<TopUpTransaction>[] = [
  {
    accessorKey: 'transactionId',
    header: 'ID',
    cell: ({ row }) => row.original.transactionId,
  },
  {
    accessorKey: 'endUserId',
    header: 'Customer ID',
    cell: ({ row }) => row.original.endUserId,
  },
  {
    accessorKey: 'paymentMethodName',
    header: 'Payment Method',
    cell: ({ row }) => {
      const name = row.original.paymentMethodName || 'N/A'
      const provider = row.original.provider
      return h('div', [
        h('div', name),
        provider ? h('div', { class: 'text-gray-500 text-xs' }, provider) : null
      ])
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => h('span', { class: 'font-semibold' }, `Rp ${formatCurrency(row.original.amount)}`),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      const colorClass = 
        status === 'Success' ? 'bg-green-100 text-green-800' :
        status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      
      return h('span', {
        class: `px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`
      }, status)
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.createdAt),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.createdAt).getTime()
      const dateB = new Date(rowB.original.createdAt).getTime()
      return dateA - dateB
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const buttons = [
        h('button', {
          onClick: () => goToDetail(row.original.transactionId),
          class: 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition duration-300 ease-in-out transform hover:scale-105'
        }, 'Detail')
      ]
      
      // Add Update Status button for Superadmin if status is Pending
      if (isSuperAdmin.value && row.original.status === 'Pending') {
        buttons.push(
          h('button', {
            onClick: () => goToUpdateStatus(row.original.transactionId),
            class: 'ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow transition duration-300 ease-in-out transform hover:scale-105'
          }, 'Update Status')
        )
      }
      
      return h('div', { class: 'flex gap-2' }, buttons)
    },
  },
]
</script>
