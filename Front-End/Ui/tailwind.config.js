/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Tailwind will scan these files
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui], // Enable DaisyUI plugin
  daisyui: {
    themes: ["light", "dark"], // Optional: Light and dark themes
  },
}

