import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                dir: 'dist', // 输出目录
                entryFileNames: '[name].js', // 入口文件名
                assetFileNames: '[name].[ext]', // 资源文件名
                chunkFileNames: '[name]-chunk.js', // chunk文件名模板
            }
        }
    }
});
//# sourceMappingURL=vite.config.js.map