import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B2430',
        paper: '#F7F5F0',
        navy: {
          50: '#EEF1F6',
          100: '#D3DBE8',
          400: '#3E5C8A',
          600: '#25405F',
          800: '#152B42',
          900: '#0E1E30'
        },
        amber: {
          400: '#D98E3F',
          500: '#C17A2E',
          600: '#A3651F'
        },
        line: '#DDD7C8'
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        body: ['Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Menlo', 'Consolas', 'monospace']
      },
      borderRadius: {
        card: '2px'
      }
    }
  },
  plugins: []
};

export default config;
