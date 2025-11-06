<script setup lang="ts">
withDefaults(defineProps<{
  id: string;
  name?: string;
  modelValue: string;
}>(), {
  modelValue: '',
});

const emit = defineEmits(['update:modelValue']);

const handleInput = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  if (target) {
    emit('update:modelValue', target.value);
  }
};
</script>

<template>
    <select
      :id="id"
      :name="name"
      :value="modelValue"
      class="rounded-lg"
      @input="handleInput"
    >
      <slot>
      </slot>
    </select>
</template>
