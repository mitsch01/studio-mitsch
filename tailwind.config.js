/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}", "./layout/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        hind: ["Hind Siliguri", "sans-serif"],
        homemade: ["HomemadeApple", "sans-serif"],
        cooperhewitt: ["Cooper Hewitt", "sans-serif"],
        grace: ['"Covered By Your Grace"', "cursive"]
      },
    }
  },
  plugins: []
}