import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.VITE_GH_PAGES_BASE || '/',
})


