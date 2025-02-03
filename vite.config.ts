import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
import {TanStackRouterVite} from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite({autoCodeSplitting: true}),
        react()
    ],
    resolve: {
        alias: {
            '@apis': path.resolve(__dirname, 'src/apis'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@config': path.resolve(__dirname, 'src/config'),
            '@entities': path.resolve(__dirname, 'src/entities'),
            '@routes': path.resolve(__dirname, 'src/routes'),
            '@stores': path.resolve(__dirname, 'src/stores'),
        }
    }
})
