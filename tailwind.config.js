/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      lineHeight: {
        'extra-loose': '2.5',
        'super-loose': '3',
      },
       fontFamily: {
        inria: ['"Inria Serif"', 'serif'],
        arsis: ['"Arsis DReg"', 'serif'],
      },
    },
  }
  ,
  plugins: [],
}

