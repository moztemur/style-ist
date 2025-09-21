import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],   // your main entry file
  format: ['esm', 'cjs', 'iife'],
  globalName: 'Stylist',     // the name for window.Stylist in <script>
  dts: true,                 // generate index.d.ts
  sourcemap: true,
  clean: true,               // clear dist before build
  outDir: 'dist',
})