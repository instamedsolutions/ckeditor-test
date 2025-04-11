import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    base: '/',
    server: {
        https: true,
        port: 3001,
        hmr: {
            host: 'localhost'
        }
    },
    plugins: [react(), mkcert()],
    build: {
        commonjsOptions: {
            include: [
                /node_modules/,
            ]
        },
        sourcemap: true
    },
    optimizeDeps: {
        include: ['react'],
    },
}));
