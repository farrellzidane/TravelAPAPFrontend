<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <p class="mt-4 text-gray-600 text-lg">Loading booking details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div class="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 class="text-xl font-semibold text-red-800 mb-2">Error Loading Booking</h2>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <div class="flex gap-4 justify-center">
            <button
              @click="fetchBookingDetail"
              class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Retry
            </button>
            <button
              @click="goBack"
              class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>

      <!-- Booking Detail -->
      <div v-else-if="booking" class="max-w-5xl mx-auto">
        <!-- Header Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <!-- Title and Status -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">
                Booking Details {{ booking.bookingID }}
              </h1>
              <span
                :class="[
                  'px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full',
                  bookingStore.getStatusClass(booking.statusColor)
                ]"
              >
                {{ booking.statusText }}
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-2">
              <!-- Removed: Refund button as refund feature removed -->
              <!--
              <button
                v-if="booking.canRefund && booking.status !== 4"
                @click="handleRefund"
                :disabled="processingAction"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Refund
              </button>
              -->
              <button
                v-if="booking.canCancel && booking.status !== 2"
                @click="showCancelModal = true"
                :disabled="processingAction"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- Booking Information Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Property & Room Info -->
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-blue-900 mb-3">Property & Room</h3>
              <div class="space-y-2">
                <div>
                  <label class="block text-sm font-medium text-blue-700">Property Name</label>
                  <p class="text-base font-semibold text-gray-800">{{ booking.propertyName }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-blue-700">Room Name</label>
                  <p class="text-base font-semibold text-gray-800">{{ booking.roomName }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-blue-700">Room Number</label>
                  <p class="text-base font-semibold text-gray-800">{{ booking.roomNumber }}</p>
                </div>
              </div>
            </div>

            <!-- Customer Info -->
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-green-900 mb-3">Customer Information</h3>
              <div class="space-y-2">
                <div>
                  <label class="block text-sm font-medium text-green-700">Customer ID</label>
                  <p class="text-xs font-mono text-gray-600 break-all">{{ booking.customerID }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-green-700">Customer Name</label>
                  <p class="text-base font-semibold text-gray-800">{{ booking.customerName }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-green-700">Email</label>
                  <p class="text-base text-gray-800">{{ booking.customerEmail }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-green-700">Phone</label>
                  <p class="text-base text-gray-800">{{ booking.customerPhone }}</p>
                </div>
              </div>
            </div>

            <!-- Check-In Info -->
            <div class="bg-purple-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-purple-900 mb-3">Check-In</h3>
              <div class="flex items-center gap-3">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p class="text-sm text-purple-700">{{ formatDate(booking.checkInDate) }}</p>
                  <p class="text-lg font-bold text-gray-800">{{ formatTime(booking.checkInDate) }}</p>
                </div>
              </div>
            </div>

            <!-- Check-Out Info -->
            <div class="bg-pink-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-pink-900 mb-3">Check-Out</h3>
              <div class="flex items-center gap-3">
                <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p class="text-sm text-pink-700">{{ formatDate(booking.checkOutDate) }}</p>
                  <p class="text-lg font-bold text-gray-800">{{ formatTime(booking.checkOutDate) }}</p>
                </div>
              </div>
            </div>

            <!-- Booking Details -->
            <div class="bg-yellow-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-yellow-900 mb-3">Booking Details</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm font-medium text-yellow-700">Total Days</span>
                  <span class="text-base font-semibold text-gray-800">{{ booking.totalDays }} days</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm font-medium text-yellow-700">Capacity</span>
                  <span class="text-base font-semibold text-gray-800">{{ booking.capacity }} people</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm font-medium text-yellow-700">Breakfast</span>
                  <span :class="[
                    'text-base font-semibold',
                    booking.breakfast ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ booking.breakfast ? 'Included' : 'Not Included' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Price Info -->
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
              <h3 class="text-lg font-semibold text-green-900 mb-3">Payment Information</h3>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-green-700">Total Price</span>
                  <span class="text-xl font-bold text-green-600">
                    Rp {{ booking.totalPrice.toLocaleString('id-ID') }}
                  </span>
                </div>
                <!-- Removed: extraPay and refund display as features removed -->
                <!--
                <div v-if="booking.extraPay > 0" class="flex justify-between items-center pt-2 border-t border-green-200">
                  <span class="text-sm font-medium text-orange-700">Extra Payment</span>
                  <span class="text-lg font-bold text-orange-600">
                    Rp {{ booking.extraPay.toLocaleString('id-ID') }}
                  </span>
                </div>
                <div v-if="booking.refund > 0" class="flex justify-between items-center pt-2 border-t border-green-200">
                  <span class="text-sm font-medium text-blue-700">Refund</span>
                  <span class="text-lg font-bold text-blue-600">
                    Rp {{ booking.refund.toLocaleString('id-ID') }}
                  </span>
                </div>
                -->
              </div>
            </div>

            <!-- Timestamps -->
            <div class="md:col-span-2 bg-gray-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Timestamps</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600">Created Date</label>
                  <p class="text-base text-gray-800">{{ formatDateTime(booking.createdDate) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600">Updated Date</label>
                  <p class="text-base text-gray-800">{{ formatDateTime(booking.updatedDate) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cancelled Booking Info -->
        <div v-if="booking.status === 2" class="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
          <div class="flex items-center gap-4">
            <div class="bg-red-100 rounded-full p-3">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-red-900">Booking Cancelled</h3>
              <p class="text-sm text-red-700">
                This booking has been cancelled. No further actions can be performed.
              </p>
            </div>
          </div>
        </div>

        <!-- Removed: Completed Booking Info (status 4 removed) -->
        <!--
        <div v-if="booking.status === 4" class="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
          <div class="flex items-center gap-4">
            <div class="bg-green-100 rounded-full p-3">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-green-900">Booking Completed</h3>
              <p class="text-sm text-green-700">
                This booking has been completed. No further actions can be performed.
              </p>
            </div>
          </div>
        </div>
        -->

        <!-- Removed: Pay Button for extra pay (feature removed) -->
        <!--
        <div v-if="booking.canPay && booking.extraPay > 0 && booking.status !== 4" class="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="bg-orange-100 rounded-full p-3">
                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-orange-900">Extra Payment Required</h3>
                <p class="text-sm text-orange-700">
                  Total amount to pay: <span class="font-bold">Rp {{ (booking.totalPrice + booking.extraPay).toLocaleString('id-ID') }}</span>
                </p>
                <p class="text-xs text-orange-600 mt-1">
                  (Base Price: Rp {{ booking.totalPrice.toLocaleString('id-ID') }} + Extra: Rp {{ booking.extraPay.toLocaleString('id-ID') }})
                </p>
              </div>
            </div>
            <button
              @click="handlePay"
              :disabled="processingAction"
              class="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-lg transition disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="processingAction" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ processingAction ? 'Processing...' : 'Pay Now' }}</span>
            </button>
          </div>
        </div>
        -->

        <!-- Pay Button (if waiting for payment) -->
        <div v-if="booking.canPay && booking.status === 0" class="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="bg-yellow-100 rounded-full p-3">
                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-yellow-900">Payment Pending</h3>
                <p class="text-sm text-yellow-700">
                  Please complete payment of <span class="font-bold">Rp {{ booking.totalPrice.toLocaleString('id-ID') }}</span>
                </p>
              </div>
            </div>
            <button
              @click="handlePay"
              :disabled="processingAction"
              class="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-lg transition disabled:bg-yellow-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="processingAction" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ processingAction ? 'Processing...' : 'Confirm Payment' }}</span>
            </button>
          </div>
        </div>

        <!-- Update Button -->
        <div v-if="booking.canUpdate && booking.status !== 2" class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="bg-blue-100 rounded-full p-3">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-blue-900">Update Available</h3>
                <p class="text-sm text-blue-700">You can modify this booking</p>
              </div>
            </div>
            <button
              @click="handleUpdate"
              class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition"
            >
              Update Booking
            </button>
          </div>
        </div>

        <!-- Back Button -->
        <div class="mt-8">
          <button
            @click="goBack"
            class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showCancelModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="showCancelModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          <!-- Modal Header -->
          <div class="bg-red-600 text-white p-6">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold">Cancel Booking?</h3>
                <p class="text-red-100 text-sm mt-1">This action cannot be undone</p>
              </div>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-6">
            <p class="text-gray-700 mb-4">
              Are you sure you want to cancel booking 
              <span class="font-semibold text-gray-900">"{{ booking?.bookingID }}"</span>?
            </p>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex gap-2">
                <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="text-sm text-yellow-800">
                  <p class="font-semibold mb-1">Important:</p>
                  <p>This action cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
            <button
              @click="showCancelModal = false"
              :disabled="processingAction"
              class="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              No
            </button>
            <button
              @click="confirmCancel"
              :disabled="processingAction"
              class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:bg-red-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="processingAction" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              <span>{{ processingAction ? 'Cancelling...' : 'Yes' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Payment Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showPaymentModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="showPaymentModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          <!-- Modal Header -->
          <div class="bg-green-600 text-white p-6">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold">Confirm Payment?</h3>
              </div>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-6">
            <p class="text-gray-700 mb-4">
              Are you sure you want to confirm payment for this booking?
            </p>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div class="text-sm text-blue-800">
                <p class="font-semibold mb-2">Payment Details:</p>
                <div class="space-y-1">
                  <p>Booking ID: <span class="font-semibold">{{ booking?.bookingID }}</span></p>
                  <p class="text-lg font-bold text-green-700">
                    Amount: Rp {{ getPaymentAmount().toLocaleString('id-ID') }}
                  </p>
                  <!-- Removed: extraPay display as feature removed -->
                  <!--
                  <div v-if="booking?.status === 0 && booking?.extraPay > 0" class="text-xs text-gray-600 mt-1">
                    (Base Price: Rp {{ booking.totalPrice.toLocaleString('id-ID') }} + Extra: Rp {{ booking.extraPay.toLocaleString('id-ID') }})
                  </div>
                  -->
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
            <button
              @click="showPaymentModal = false"
              :disabled="processingAction"
              class="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              No
            </button>
            <button
              @click="confirmPayment"
              :disabled="processingAction"
              class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:bg-green-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="processingAction" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              <span>{{ processingAction ? 'Processing...' : 'Yes' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Removed: Refund Confirmation Modal as refund feature removed -->
    <!--
    <Teleport to="body">
      <div
        v-if="showRefundModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="showRefundModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          <div class="bg-blue-600 text-white p-6">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold">Process Refund?</h3>
              </div>
            </div>
          </div>
          <div class="p-6">
            <p class="text-gray-700 mb-4">
              Are you sure you want to process the refund for this booking?
            </p>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div class="text-sm text-blue-800">
                <p class="font-semibold mb-2">Refund Details:</p>
                <div class="space-y-1">
                  <p>Booking ID: <span class="font-semibold">{{ booking?.bookingID }}</span></p>
                  <p class="text-lg font-bold text-blue-700">
                    Refund amount: Rp {{ (booking?.refund || 0).toLocaleString('id-ID') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
            <button
              @click="showRefundModal = false"
              :disabled="processingAction"
              class="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              No
            </button>
            <button
              @click="confirmRefund"
              :disabled="processingAction"
              class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="processingAction" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              <span>{{ processingAction ? 'Processing...' : 'Yes' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useBookingStore } from '@/stores/booking/booking.stores'
import type { Booking } from '@/interfaces/booking.interface'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()

const booking = ref<Booking | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const showCancelModal = ref(false)
const showPaymentModal = ref(false)
// Removed: showRefundModal as refund feature removed
// const showRefundModal = ref(false)
const processingAction = ref(false)

const fetchBookingDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const bookingId = route.params.id as string
    booking.value = await bookingStore.fetchBookingById(bookingId)
  } catch (err: any) {
    console.error('Error fetching booking detail:', err)
    error.value = err.message || 'Failed to load booking details'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatTime = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateTime = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getPaymentAmount = (): number => {
  if (!booking.value) return 0
  
  // Status 0: Pay totalPrice (extraPay feature removed)
  if (booking.value.status === 0) {
    return booking.value.totalPrice
  }
  
  return 0
}

const handlePay = async () => {
  if (!booking.value) return
  
  // Prevent payment if booking is cancelled (status 2)
  if (booking.value.status === 2) {
    toast.error('Cannot confirm payment for cancelled booking')
    return
  }
  
  showPaymentModal.value = true
}

// Removed: handleRefund method as refund feature removed
/*
const handleRefund = async () => {
  if (!booking.value) return
  
  if (booking.value.status === 2) {
    toast.error('Cannot process refund for cancelled booking')
    return
  }
  
  showRefundModal.value = true
}
*/

const confirmPayment = async () => {
  if (!booking.value) return
  
  // Double check before API call (status 2 = cancelled)
  if (booking.value.status === 2) {
    toast.error('Cannot confirm payment for cancelled booking')
    showPaymentModal.value = false
    return
  }
  
  processingAction.value = true
  
  try {
    const updatedBooking = await bookingStore.payBooking(booking.value.bookingID)
    booking.value = updatedBooking
    showPaymentModal.value = false
    
    // Refresh the booking list in the store
    await bookingStore.fetchAllBookings()
  } catch (err: any) {
    console.error('Payment confirmation failed:', err)
  } finally {
    processingAction.value = false
  }
}

const confirmCancel = async () => {
  if (!booking.value) return
  
  processingAction.value = true
  
  try {
    const updatedBooking = await bookingStore.cancelBooking(booking.value.bookingID)
    booking.value = updatedBooking
    showCancelModal.value = false
    
    // Refresh the booking list in the store
    await bookingStore.fetchAllBookings()
  } catch (err: any) {
    console.error('Booking cancellation failed:', err)
  } finally {
    processingAction.value = false
  }
}

// Removed: confirmRefund method as refund feature removed
/*
const confirmRefund = async () => {
  if (!booking.value) return
  
  if (booking.value.status === 2) {
    toast.error('Cannot process refund for cancelled booking')
    showRefundModal.value = false
    return
  }
  
  processingAction.value = true
  
  try {
    const updatedBooking = await bookingStore.requestRefund(booking.value.bookingID)
    booking.value = updatedBooking
    showRefundModal.value = false
    
    await bookingStore.fetchAllBookings()
  } catch (err: any) {
    console.error('Refund request failed:', err)
  } finally {
    processingAction.value = false
  }
}
*/

const handleUpdate = () => {
  if (!booking.value) return
  router.push(`/booking/${booking.value.bookingID}/edit`)
}

const goBack = () => {
  router.push('/bookings')
}

onMounted(() => {
  fetchBookingDetail()
})
</script>