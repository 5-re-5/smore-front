import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteReact(),
    tailwindcss(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@processes': path.resolve(__dirname, './src/processes'),
      // global 에러 해결용
      global: 'globalthis',
    },
  },
  define: {
    // 전역으로 globalThis를 global로 정의
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer', 'process'], // ✅ 일부 패키지에서 필요
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
});
