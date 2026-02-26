import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                surface: {
                    DEFAULT: "hsl(var(--surface))",
                    hover: "hsl(var(--surface-hover))",
                },
                glow: "hsl(var(--glow))",
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['var(--font-display)', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
            },
            borderRadius: {
                '4xl': '2rem',
            },
            animation: {
                'aurora': 'aurora 15s ease infinite',
                'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
                'shimmer': 'shimmer 3s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float-slow 15s ease-in-out infinite',
                'slide-up-fade': 'slide-up-fade 0.5s ease-out forwards',
                'shine': 'shine 3s ease-in-out infinite',
            },
            keyframes: {
                aurora: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                'glow-pulse': {
                    '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
                    '50%': { opacity: '0.7', transform: 'scale(1.05)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translate(0, 0)' },
                    '25%': { transform: 'translate(10px, -15px)' },
                    '50%': { transform: 'translate(-5px, -25px)' },
                    '75%': { transform: 'translate(-15px, -10px)' },
                },
                'slide-up-fade': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                shine: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
};
export default config;
