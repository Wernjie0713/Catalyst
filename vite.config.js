import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { resolve } from 'path';

// Get all JSX files from Pages directory
const pages = Object.fromEntries(
    glob.sync('resources/js/Pages/**/*.jsx').map(file => [
        file.replace(/^resources\/js\/Pages\/|\.jsx$/g, ''),
        resolve(__dirname, file)
    ])
);

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.jsx',
                'resources/css/app.css',
                ...Object.values(pages)
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
