import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {

  const isIntegrate = mode === 'integrate'
  const isProduction = mode === 'production'

  const base = (isProduction || isIntegrate) ? '/accommodation-service/' : '/'

  const serverConfig = isIntegrate 
    ? {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {
          clientPort: 80,
          path: "/accommodation-service/",
        }
      }
    : undefined

  return {
    base,
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: serverConfig
  }
})