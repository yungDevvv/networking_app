/** @type {import('tailwindcss').Config} */
// const {nextui} = require("@nextui-org/theme");
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}', // Next.js Pages
    './src/components/**/*.{js,ts,jsx,tsx}', // Next.js Components
    './src/app/**/*.{js,ts,jsx,tsx}', // Next.js App 
    // single component styles
    // "./node_modules/@nextui-org/theme/dist/components/button.js",
    // // or you can use a glob pattern (multiple component styles)
    // './node_modules/@nextui-org/theme/dist/components/(button|snippet|code|input).js'
  ],
  theme: {
    extend: {
      screens: {
        'thousand': '1000px', 
      },
    },
  },
  // plugins: [nextui()],
  plugins: [],
}

