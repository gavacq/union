/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        red1: {
          DEFAULT: '#cd3125',
        },
        gray1: {
          "dark": "#949494",
          "light": "#d9d9d9",
          DEFAULT: '#d1d3d0',
        },
        lightblue1: {
          DEFAULT: '#d9edf6',
        },
        darkblue1: {
          DEFAULT: '#263749'
        },
        "chatleft": {
          DEFAULT: '#334956',
        },
        "chatright": {
          DEFAULT: '#015d48',
        },
        "chatbackground": {
          DEFAULT: '#070711',
        },
      },
    },
  },
  plugins: [],
}

