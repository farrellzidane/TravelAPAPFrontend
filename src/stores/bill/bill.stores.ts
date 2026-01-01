import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import type { Bill, BillFilter } from '@/interfaces/bill.interface'
import { billService } from '@/services/bill.service'
import { BillStatusNames, BillStatusColors } from '@/interfaces/bill.interface'

export const useBillStore = defineStore('bill', () => {
  const bills = ref<Bill[]>([])
  const currentBill = ref<Bill | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const totalBills = computed(() => bills.value.length)
  
  const unpaidBills = computed(() => 
    bills.value.filter(bill => bill.status === 0)
  )
  
  const paidBills = computed(() => 
    bills.value.filter(bill => bill.status === 1)
  )
  
  const totalUnpaidAmount = computed(() => 
    unpaidBills.value.reduce((sum, bill) => sum + bill.amount, 0)
  )
  
  const getBillById = computed(() => (billId: string) => 
    bills.value.find(bill => bill.billId === billId)
  )

  // Helper function to enrich bill data with UI properties
  const enrichBill = (bill: Bill): Bill => {
    return {
      ...bill,
      statusText: BillStatusNames[bill.status] || 'Unknown',
      statusColor: BillStatusColors[bill.status] || 'secondary'
    }
  }

  // Actions
  const fetchAllBills = async (filter?: BillFilter) => {
    loading.value = true
    error.value = null

    try {
      console.log('Fetching all bills with filter:', filter)
      
      const data = await billService.getAllBills(filter)
      bills.value = data.map(enrichBill)
      
      toast.success(`Successfully loaded ${bills.value.length} bill(s)`)
      return bills.value
    } catch (err: any) {
      console.error('Error fetching bills:', err)
      
      error.value = err.message || 'Failed to fetch bills'
      
      if (err.message.includes('No Bill Found')) {
        bills.value = []
        // Don't show error toast for empty results
      } else {
        toast.error(error.value || 'Failed to fetch bills')
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCustomerBills = async (
    customerId: string,
    status?: number,
    sortBy?: string,
    sortDirection?: string
  ) => {
    loading.value = true
    error.value = null

    try {
      console.log('Fetching customer bills:', { customerId, status, sortBy, sortDirection })
      
      const data = await billService.getCustomerBills(customerId, status, sortBy, sortDirection)
      bills.value = data.map(enrichBill)
      
      toast.success(`Successfully loaded ${bills.value.length} bill(s)`)
      return bills.value
    } catch (err: any) {
      console.error('Error fetching customer bills:', err)
      
      error.value = err.message || 'Failed to fetch customer bills'
      
      if (err.message.includes('No Bill Found')) {
        bills.value = []
        // Don't show error toast for empty results
      } else {
        toast.error(error.value || 'Failed to fetch customer bills')
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchServiceBills = async (
    serviceName: string,
    status?: number,
    customerId?: string
  ) => {
    loading.value = true
    error.value = null

    try {
      console.log('Fetching service bills:', { serviceName, status, customerId })
      
      const data = await billService.getServiceBills(serviceName, status, customerId)
      bills.value = data.map(enrichBill)
      
      toast.success(`Successfully loaded ${bills.value.length} bill(s)`)
      return bills.value
    } catch (err: any) {
      console.error('Error fetching service bills:', err)
      
      error.value = err.message || 'Failed to fetch service bills'
      toast.error(error.value || 'Failed to fetch service bills')
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchBillById = async (billId: string) => {
    loading.value = true
    error.value = null

    try {
      console.log('Fetching bill by ID:', billId)
      
      const data = await billService.getBillById(billId)
      currentBill.value = enrichBill(data)
      
      return currentBill.value
    } catch (err: any) {
      console.error('Error fetching bill:', err)
      
      error.value = err.message || 'Failed to fetch bill'
      
      if (err.message.includes('No Bill Found')) {
        toast.error('Bill not found')
      } else {
        toast.error(error.value || 'Failed to fetch bill')
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const payBill = async (billId: string, couponCode?: string): Promise<Bill> => {
    loading.value = true
    error.value = null

    try {
      console.log('Paying bill:', billId, couponCode)
      
      const data = await billService.payBill(billId, { couponCode })
      const paidBill = enrichBill(data)
      
      // Update current bill if it's the same
      if (currentBill.value?.billId === billId) {
        currentBill.value = paidBill
      }
      
      // Update in bills array
      const index = bills.value.findIndex(b => b.billId === billId)
      if (index !== -1) {
        bills.value[index] = paidBill
      }
      
      toast.success('Bill paid successfully!')
      return paidBill
    } catch (err: any) {
      console.error('Error paying bill:', err)
      
      error.value = err.message || 'Failed to pay bill'
      toast.error(error.value || 'Failed to pay bill')
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentBill = () => {
    currentBill.value = null
  }

  return {
    // State
    bills,
    currentBill,
    loading,
    error,
    
    // Getters
    totalBills,
    unpaidBills,
    paidBills,
    totalUnpaidAmount,
    getBillById,
    
    // Actions
    fetchAllBills,
    fetchCustomerBills,
    fetchServiceBills,
    fetchBillById,
    payBill,
    clearError,
    clearCurrentBill
  }
})
