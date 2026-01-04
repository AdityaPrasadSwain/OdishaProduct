

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",

    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#ea580c', // Premium Burnt Orange
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                secondary: {
                    DEFAULT: '#0f172a', // Slate 900
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
                success: '#16a34a', // Green 600
                warning: '#ca8a04', // Yellow 600
                danger: '#dc2626', // Red 600
                info: '#2563eb', // Blue 600
                dark: '#0f172a',
                light: '#f8fafc',
                muted: '#64748b',
                border: '#e2e8f0',
            },
            fontFamily: {
                sans: ['"Outfit"', '"Inter"', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                card: '0 0 20px 0 rgba(0,0,0,0.05)',
                inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            }
        },
    },
    plugins: [],
};
