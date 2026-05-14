/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium dark palette
        'dark': {
          '950': '#09090b',
          '900': '#111118',
          '850': '#16161f',
          '800': '#1e1e2a',
          '700': '#2a2a3e',
          '600': '#353548',
        },
        // Accent colors
        'accent': {
          '50': '#f5f3ff',
          '100': '#ede9fe',
          '200': '#ddd6fe',
          '300': '#cabffd',
          '400': '#a78bfa',
          '500': '#8b5cf6',
          '600': '#7c3aed',
          '700': '#6d28d9',
          '800': '#5b21b6',
          '900': '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px', letterSpacing: '-0.3px' }],
        sm: ['13px', { lineHeight: '18px', letterSpacing: '-0.2px' }],
        base: ['14px', { lineHeight: '20px', letterSpacing: '-0.2px' }],
        lg: ['16px', { lineHeight: '24px', letterSpacing: '-0.3px' }],
        xl: ['18px', { lineHeight: '28px', letterSpacing: '-0.4px' }],
        '2xl': ['20px', { lineHeight: '28px', letterSpacing: '-0.4px' }],
        '3xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.5px' }],
        '4xl': ['28px', { lineHeight: '36px', letterSpacing: '-0.6px' }],
      },
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'base': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
        'full': '9999px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'base': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'md': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'lg': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
        'xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
        '2xl': '0 40px 60px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'base': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 20% 50%, rgba(139, 92, 246, 0.08) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(99, 102, 241, 0.08) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
    },
  },
  plugins: [
    // Custom utilities plugin
    function ({ addUtilities, addComponents, theme }) {
      addUtilities({
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.02)',
          'backdrop-filter': 'blur(12px)',
          '@supports (backdrop-filter: blur(0))': {},
        },
        '.glass-lg': {
          'background': 'rgba(255, 255, 255, 0.04)',
          'backdrop-filter': 'blur(24px)',
        },
        '.safe-gradient': {
          'background': 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.05))',
        },
        '.text-gradient': {
          '@apply bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-400': {},
        },
        '.truncate-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.truncate-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
      });

      addComponents({
        '.btn-primary': {
          '@apply px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0': {},
        },
        '.btn-secondary': {
          '@apply px-5 py-2.5 rounded-lg bg-white/[0.05] text-zinc-100 font-semibold text-sm border border-white/10 transition-all duration-200 hover:bg-white/10 hover:border-white/20 active:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        '.btn-ghost': {
          '@apply px-5 py-2.5 rounded-lg text-zinc-300 font-medium text-sm transition-all duration-200 hover:text-white hover:bg-white/5 active:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        '.card': {
          '@apply bg-white/[0.02] border border-white/5 rounded-2xl transition-all duration-300': {},
        },
        '.card-hover': {
          '@apply card hover:bg-white/[0.04] hover:border-white/10 hover:shadow-lg hover:shadow-black/20': {},
        },
        '.input': {
          '@apply w-full h-10 px-4 rounded-lg text-sm outline-none transition-all bg-white/[0.03] border border-white/10 text-white placeholder:text-zinc-500 focus:bg-white/[0.05] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10': {},
        },
        '.label': {
          '@apply block text-sm font-medium text-zinc-300 mb-2': {},
        },
      });
    },
  ],
}
