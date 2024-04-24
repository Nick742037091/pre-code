import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), UnoCSS()],
  build: {
    rollupOptions: {
      output: {
        dir: '../extension/out/table-page', // 输出目录
        entryFileNames: '[name].js', // 入口文件名
        assetFileNames: '[name].[ext]', // 资源文件名
        chunkFileNames: '[name]-chunk.js' // chunk文件名模板
      }
    }
  }
})
