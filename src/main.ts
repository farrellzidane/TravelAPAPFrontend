import './assets/main.css'
import './config/axios.config' // Import axios config to setup interceptors

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Toaster } from 'vue-sonner'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Register Toaster component globally
app.component('Toaster', Toaster)

app.mount('#app')