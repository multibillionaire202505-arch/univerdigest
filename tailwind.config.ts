/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // blue
          dark: "#1e40af",
          light: "#60a5fa",
        },
        accent: {
          DEFAULT: "#f97316", // orange
          dark: "#c2410c",
          light: "#fdba74",
        },
      },
    },
  },
  plugins: [],
};
