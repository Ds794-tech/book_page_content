import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      output: {
        // Control how entry chunks (JS) are named
        entryFileNames: "assets/js/[name]-[hash].js",
        // Control how code-split chunks are named
        chunkFileNames: "assets/js/[name]-[hash].js",
        // Control how CSS & other assets are named
        assetFileNames: ({ name }) => {
          if (name && name.endsWith(".css")) {
            return "assets/css/[name]-[hash][extname]";
          }
          return "assets/[ext]/[name]-[hash][extname]";
        },
      },
    },
  },
})
