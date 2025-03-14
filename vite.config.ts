import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    base: '/',
    server: {
        https: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            maxSessionMemory: 100,
            peerMaxConcurrentStreams: 100,
        },
        port: 3001,
        hmr: {
            host: 'localhost'
        }
    },
    plugins: [reactRefresh(), mkcert()],
    build: {
        commonjsOptions: {
            include: [
                /node_modules/,
            ]
        },
        sourcemap: true
    },
    optimizeDeps: {
        include: ['react', 'ckeditor5', 'ckeditor5-premium-features'],
    },
}));