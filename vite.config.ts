import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import typedCssModulesPlugin from 'vite-plugin-typed-css-modules';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080
  },
  plugins: [
    typedCssModulesPlugin(),
    react()
  ]
})
