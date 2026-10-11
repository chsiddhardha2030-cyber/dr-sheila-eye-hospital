import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
      },
    },
  },
  server: {
    watch: {
      ignored: [
        '**/Images/**',
        '**/Doctor Portraits/**',
        '**/*branch images/**',
        '**/Exploded-video-with-frames/**',
        '**/node_modules/**',
        '**/.git/**',
      ],
    },
  },
})
