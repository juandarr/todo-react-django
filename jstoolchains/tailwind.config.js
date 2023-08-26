/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../templates/*.html", "../assets/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

