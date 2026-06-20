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
                primary: { DEFAULT: '#6C5CE7', hover: '#5747C7', light: '#ECEAFB' },
                accent: { teal: '#14B8A6', tealBg: '#DFF5F1' },
                status: { success: '#14B8A6', warning: '#F5A623', error: '#E0455A', info: '#6C5CE7' },
                bg: { page: '#F8F7FC', band: '#ECEAFB', surface: '#FFFFFF', dark: '#1B1A3A' },
                text: { primary: '#14141F', secondary: '#6B7280', onDark: '#F4F3FB', onPrimary: '#FFFFFF' },
                border: { DEFAULT: 'var(--color-border)' },
            },
            fontFamily: {
                sans: ['"Outfit"', '"Inter"', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
                'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                'glow-primary': '0 0 20px rgba(249, 115, 22, 0.4)',
                'glow-accent': '0 0 20px rgba(139, 92, 246, 0.4)',
                'soft': '0 20px 40px -15px rgba(0,0,0,0.05)',
            },
            backdropBlur: {
                'xs': '2px',
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' }
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-gradient': 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.98) 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
                'glass-gradient-dark': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
            }
        },
    },
    plugins: [],
};
