<template>
  <div id="app">
    <VNavbar />
    <RouterView />
    <Toaster position="top-right" :duration="3000" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import VNavbar from './components/common/VNavbar.vue'
</script>

<style>
#app {
  min-height: 100vh;
}
</style>