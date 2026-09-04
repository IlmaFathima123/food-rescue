/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F1E4",
        ink: "#2A2318",
        "ink-soft": "#5B5040",
        leaf: {
          DEFAULT: "#2F5D3A",
          deep: "#1D3D26",
          light: "#E4EEE3",
        },
        turmeric: {
          DEFAULT: "#E3A72E",
          deep: "#B4841F",
          light: "#FBEDCC",
        },
        clay: {
          DEFAULT: "#C1512F",
          deep: "#93391F",
          light: "#F6E1D6",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Work Sans'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "2px",
      },
    },
  },
  plugins: [],
}
