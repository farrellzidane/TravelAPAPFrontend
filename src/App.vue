<template>
  <div id="app">
    <VNavbar v-if="!isAuthPage" />
    <main :class="{ 'pt-15': !isAuthPage }">
      <RouterView />
    </main>
    <Toaster position="top-right" :duration="3000" />
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import VNavbar from './components/common/VNavbar.vue'
import { computed } from 'vue'

const route = useRoute()

// Hide navbar on auth pages (login, register)
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>