/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./layout/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        hind: ["Hind Siliguri", "sans-serif"],
        homemade: ["HomemadeApple", "sans-serif"],
        cooperhewitt: ["Cooper Hewitt", "sans-serif"],
        grace: ['"Covered By Your Grace"', "cursive"],
      },
      colors: {
        raspberry: {
          DEFAULT: "#e8175d",
          hover: "#c3144f",
        },
      },
      spacing: {
        section: "6rem",      // 96px — vertical space between major sections
        "section-sm": "4rem", // 64px — tighter section spacing on mobile
        content: "1024px",    // max-width for content (matches max-screen-lg)
      },
    },
  },
  plugins: [],
}