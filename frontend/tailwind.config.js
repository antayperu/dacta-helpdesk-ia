/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'int-purple':       '#5B33D4',
        'int-purple-dark':  '#453E72',
        'int-purple-deep':  '#3B2A8F',
        'int-purple-mid':   '#4F38A2',
        'int-sidebar':      '#353C44',
        'int-sidebar-hover':'#2C333B',
        'int-cyan':         '#38C1E1',
        'int-cyan-dark':    '#2AAEC8',
        'int-bg':           '#F2F0FE',
        'int-bg-md':        '#E9E7FF',
        'int-text-dark':    '#1E1B2E',
        'int-text-mid':     '#4A4560',
        'int-text-light':   '#8B87A8',
        'int-border':       '#DDD9F5',
        'int-border-light': '#EEEAFF',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'int-sm': '0 1px 3px rgba(91,51,212,0.06)',
        'int-md': '0 4px 16px rgba(91,51,212,0.08)',
        'int-lg': '0 8px 32px rgba(91,51,212,0.12)',
        'int-btn': '0 8px 24px rgba(91,51,212,0.30)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
