/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          base: '#080c12',
          surface: '#0d1117',
          elevated: '#111827',
          overlay: '#161f2e',
        },
        border: {
          subtle: '#1e2d3d',
          default: '#243447',
          strong: '#2d4159',
        },
        accent: {
          violet: '#7c3aed',
          'violet-bright': '#8b5cf6',
          blue: '#2563eb',
          'blue-bright': '#3b82f6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
          fuchsia: '#d946ef',
        },
        text: {
          primary: '#f0f4f8',
          secondary: '#94a3b8',
          muted: '#4b6480',
          dim: '#2d4159',
        },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M40 0H0v40' stroke='%231e2d3d' stroke-width='0.5'/%3E%3C/svg%3E\")",
        'glow-violet': 'radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)',
        'glow-blue': 'radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, transparent 70%)',
        'glow-cyan': 'radial-gradient(ellipse at center, rgba(6,182,212,0.1) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(124,58,237,0.2)',
        'glow-md': '0 0 20px rgba(124,58,237,0.25)',
        'glow-lg': '0 0 40px rgba(124,58,237,0.3)',
        'card': '0 1px 0 rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.03)',
      },
      animation: {
        blob: 'blob 7s infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
};