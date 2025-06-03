/// <reference types="vitest" />
import {defineConfig} from 'vitest/config';
import path from 'path';


export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        env: {
            TAXI_PERALTA_API_URL: 'http://test-api-url.com',
            TAXI_PERALTA_API_KEY: 'test-api-key'
        },
        // setupFiles: ['./src/__tests__/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // <-- muy importante
        },
    },
});
