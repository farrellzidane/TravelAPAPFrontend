<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="handleCancel"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <!-- Modal Header -->
        <div :class="[
          'text-white p-6',
          variant === 'danger' ? 'bg-red-600' :
          variant === 'warning' ? 'bg-yellow-600' :
          variant === 'info' ? 'bg-blue-600' :
          'bg-gray-600'
        ]">
          <div class="flex items-center gap-3">
            <div class="flex-shrink-0">
              <svg v-if="variant === 'danger'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <svg v-else-if="variant === 'warning'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <svg v-else class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold">{{ title }}</h3>
              <p v-if="subtitle" :class="[
                'text-sm mt-1',
                variant === 'danger' ? 'text-red-100' :
                variant === 'warning' ? 'text-yellow-100' :
                'text-blue-100'
              ]">{{ subtitle }}</p>
            </div>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <p class="text-gray-700 whitespace-pre-line">{{ message }}</p>
          
          <div v-if="notes && notes.length > 0" :class="[
            'border rounded-lg p-4 mt-4',
            variant === 'danger' ? 'bg-red-50 border-red-200' :
            variant === 'warning' ? 'bg-yellow-50 border-yellow-200' :
            'bg-blue-50 border-blue-200'
          ]">
            <div class="flex gap-2">
              <svg :class="[
                'w-5 h-5 flex-shrink-0 mt-0.5',
                variant === 'danger' ? 'text-red-600' :
                variant === 'warning' ? 'text-yellow-600' :
                'text-blue-600'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div :class="[
                'text-sm',
                variant === 'danger' ? 'text-red-800' :
                variant === 'warning' ? 'text-yellow-800' :
                'text-blue-800'
              ]">
                <p class="font-semibold mb-1">{{ notesTitle || 'Important Notes:' }}</p>
                <ul class="list-disc list-inside space-y-1">
                  <li v-for="(note, index) in notes" :key="index">{{ note }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
          <button
            @click="handleCancel"
            :disabled="loading"
            class="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ cancelText }}
          </button>
          <button
            @click="handleConfirm"
            :disabled="loading"
            :class="[
              'px-6 py-2.5 text-white font-semibold rounded-lg transition flex items-center gap-2',
              variant === 'danger' ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-300' :
              variant === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300' :
              'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300',
              'disabled:cursor-not-allowed'
            ]"
          >
            <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            <span>{{ loading ? loadingText : confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  modelValue: boolean
  title: string
  message: string
  subtitle?: string
  variant?: 'danger' | 'warning' | 'info'
  confirmText?: string
  cancelText?: string
  loadingText?: string
  loading?: boolean
  notes?: string[]
  notesTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'warning',
  confirmText: 'Yes, Confirm',
  cancelText: 'No, Cancel',
  loadingText: 'Processing...',
  loading: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  if (!props.loading) {
    emit('update:modelValue', false)
    emit('cancel')
  }
}
</script>
