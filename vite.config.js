import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: import.meta.Mode === 'production' ? '/resources/prd-retire/' : '/',
  server: {
    port: 1000,
    host: '0.0.0.0',
  },
  build: {
    outDir:
      import.meta.Mode === 'production' ? path.resolve('../../resources/prd-retire') : 'dist',
    assetsDir: '',
    sourcemap: false,
    rollupOptions: {
      input: {
        // index頁
        index: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: (id) => {
          // 此處將 node_modules 內的套件與主程式切開打包
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
        chunkFileNames: (chunkInfo) => {
          const modules = [
            // 套件名稱
          ]
          if (modules.some((m) => m === chunkInfo.name)) {
            // 將對應到的套件轉名稱
            return 'js/vendor-[hash].js'
          }
          return 'js/[name].js'
        },
        // js 入口檔案
        entryFileNames: `js/[name].js`,
        // js、css 編譯檔名規則
        assetFileNames: '[ext]/[name].[ext]',
      },
    },
  },
})
