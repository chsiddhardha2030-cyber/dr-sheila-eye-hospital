import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
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
