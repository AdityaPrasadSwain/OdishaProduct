

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
                primary: '#5D87FF',
                'primary-light': '#ECF2FF',
                secondary: '#49BEFF',
                'secondary-light': '#E8F7FF',
                success: '#13DEB9',
                'success-light': '#E6FFFA',
                info: '#539BFF',
                'info-light': '#EBF3FE',
                warning: '#FA896B',
                'warning-light': '#FEF5F5',
                danger: '#FA896B',
                'danger-light': '#FEF5F5',
                dark: '#2A3547',
                'dark-light': '#F2F6FA',
                muted: '#5A6A85',
                border: '#EAEFF4',
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            boxShadow: {
                md: '0px 1px 4px rgba(0,0,0,0.08)',
                lg: '0px 2px 20px rgba(0,0,0,0.04)',
                card: '0 0 20px 0 rgba(0,0,0,0.05)',
            },
        },
    },
    plugins: [],
};
