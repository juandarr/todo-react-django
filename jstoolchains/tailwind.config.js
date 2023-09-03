/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../templates/*.html", "./src/*.{tsx,ts,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

