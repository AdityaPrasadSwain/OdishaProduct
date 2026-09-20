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
                primary: { DEFAULT: '#B91C1C', hover: '#991B1B', light: '#FEE2E2' }, // Sambalpuri Red/Terracotta
                secondary: { DEFAULT: '#0369A1', hover: '#0284C7', light: '#E0F2FE' }, // Deep Blue/Ikat
                accent: { DEFAULT: '#D97706', hover: '#B45309', light: '#FEF3C7' }, // Golden/Brass
                status: { success: '#16A34A', warning: '#F59E0B', error: '#DC2626', info: '#2563EB' },
                bg: { page: '#FAFAFA', surface: '#FFFFFF', dark: '#111827', muted: '#F3F4F6', band: '#F3F4F6' },
                text: { primary: '#111827', secondary: '#4B5563', muted: '#9CA3AF', onPrimary: '#FFFFFF', onDark: '#F9FAFB' },
                border: { DEFAULT: '#E5E7EB', focus: '#B91C1C' },
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
