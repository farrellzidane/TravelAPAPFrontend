<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-blue-700">Room Types</h3>
      <button
        type="button"
        @click="addRoomType"
        class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow transition duration-300 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Type
      </button>
    </div>

    <div
      v-for="(roomType, index) in modelValue"
      :key="roomType.id"
      class="bg-blue-50 p-6 rounded-lg border-2 border-blue-100 relative"
    >
      <div class="absolute top-4 right-4">
        <button
          type="button"
          @click="removeRoomType(index)"
          class="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1 rounded hover:bg-red-50"
          :disabled="modelValue.length === 1"
          :class="{ 'opacity-50 cursor-not-allowed': modelValue.length === 1 }"
        >
          Remove
        </button>
      </div>

      <h4 class="text-md font-semibold text-blue-700 mb-4">Room Type {{ index + 1 }}</h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Room Type Name -->
        <div>
          <label class="block text-sm font-medium text-blue-700 mb-2">
            Room Type <span class="text-red-500">*</span>
          </label>
          <select
            v-model="roomType.name"
            required
            class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Select Room Type</option>
            <option v-for="option in roomTypeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>

        <!-- Facility -->
        <div>
          <label class="block text-sm font-medium text-blue-700 mb-2">
            Facility <span class="text-red-500">*</span>
          </label>
          <input
            v-model="roomType.facility"
            type="text"
            required
            placeholder="e.g., WiFi, TV, Air Conditioning"
            class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Capacity -->
        <div>
          <label class="block text-sm font-medium text-blue-700 mb-2">
            Capacity <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="roomType.capacity"
            type="number"
            required
            min="1"
            placeholder="0"
            class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Price -->
        <div>
          <label class="block text-sm font-medium text-blue-700 mb-2">
            Price <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="roomType.price"
            type="number"
            required
            min="0"
            placeholder="0"
            class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Floor -->
        <div>
          <label class="block text-sm font-medium text-blue-700 mb-2">
            Floor <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="roomType.floor"
            type="number"
            required
            min="0"
            placeholder="0"
            class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Unit -->
        <div>
          <label class="block text-sm font-medium text-blue-700 mb-2">
            Unit <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="roomType.unit"
            type="number"
            required
            min="1"
            placeholder="0"
            class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Description -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-blue-700 mb-2">
            Description <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="roomType.description"
            required
            rows="3"
            placeholder="Enter room type description"
            class="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RoomTypeForm } from '@/interfaces/property.interface'
import { ROOM_TYPE_OPTIONS } from '@/interfaces/property.interface'

interface Props {
  modelValue: RoomTypeForm[]
  propertyType: string
}

interface Emits {
  (e: 'update:modelValue', value: RoomTypeForm[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const roomTypeOptions = computed(() => {
  return props.propertyType ? ROOM_TYPE_OPTIONS[props.propertyType] || [] : []
})

const addRoomType = () => {
  const newRoomType: RoomTypeForm = {
    id: `room-${Date.now()}-${Math.random()}`,
    name: '',
    facility: '',
    capacity: null,
    price: null,
    floor: null,
    unit: null,
    description: ''
  }
  
  emit('update:modelValue', [...props.modelValue, newRoomType])
}

const removeRoomType = (index: number) => {
  if (props.modelValue.length > 1) {
    const updated = props.modelValue.filter((_, i) => i !== index)
    emit('update:modelValue', updated)
  }
}
</script>