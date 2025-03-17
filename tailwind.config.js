import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                'space': ['Space Grotesk', 'sans-serif'],
                'outfit': ['Outfit', 'sans-serif'],
            },
            keyframes: {
                'fade-in-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                'fade-in': {
                    '0%': {
                        opacity: '0'
                    },
                    '100%': {
                        opacity: '1'
                    }
                }
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.5s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'fade-in-up-slow': 'fade-in-up 0.7s ease-out',
                'fade-in-up-slower': 'fade-in-up 0.9s ease-out',
            }
        },
    },

    plugins: [forms],
};
