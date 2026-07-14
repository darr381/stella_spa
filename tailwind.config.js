/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          green: 'var(--color-nature-green)',      
          greenLight: 'var(--color-nature-green-light)', 
          sage: 'var(--color-nature-sage)',        
        },
        lavender: {
          DEFAULT: 'var(--color-lavender)',        
          light: 'var(--color-lavender-light)',    
        },
        base: {
          white: 'var(--color-base-white)',        
          cream: 'var(--color-base-cream)',        
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
