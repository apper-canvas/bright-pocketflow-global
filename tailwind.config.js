/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED',
        accent: '#10B981',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
        surface: '#FFFFFF',
        background: '#F8FAFC'
      },
      fontFamily: {
        display: ['DM Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'gradient-warning': 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        'gradient-danger': 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)'
      },
      boxShadow: {
        'elevation-1': '0 2px 4px rgba(0, 0, 0, 0.08)',
        'elevation-2': '0 4px 8px rgba(0, 0, 0, 0.12)',
        'elevation-3': '0 8px 16px rgba(0, 0, 0, 0.16)'
      }
    },
  },
  plugins: [],
}