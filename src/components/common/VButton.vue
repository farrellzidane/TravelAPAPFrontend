<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import VButton from '../common/VButton.vue'

const route = useRoute()

const getLinkClass = (path: string) =>
  route.path === path ? 'text-blue-600' : 'text-black hover:text-blue-600'
</script>

<template>
  <header class="fixed top-0 left-0 flex items-center w-full gap-4 px-3 py-4 bg-white z-50">
    <RouterLink to="/" class="text-xl font-bold text-blue-600">TravelAPAP</RouterLink>

    <nav class="flex gap-4">
      <RouterLink to="/property" :class="getLinkClass('/property')">Property</RouterLink>
      <RouterLink to="/bookings" :class="getLinkClass('/bookings')">Booking</RouterLink>
      <RouterLink to="/statistics" :class="getLinkClass('/statistics')">Statistic</RouterLink>

       
    </nav>
  </header>
</template>
