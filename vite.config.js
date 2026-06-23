import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import { fileURLToPath, URL } from 'node:url';

const src = (p) => fileURLToPath(new URL(`./src/${p}`, import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl(), // import .glsl / .vert / .frag as strings
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': src('components'),
      '@sections': src('sections'),
      '@utils': src('utils'),
      '@hooks': src('hooks'),
      '@assets': src('assets'),
      '@shaders': src('shaders'),
    },
  },
  server: {
    host: true,
  },
  build: {
    target: 'esnext',
  },
});
