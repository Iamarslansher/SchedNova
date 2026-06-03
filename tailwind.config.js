export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        glass: "0 20px 60px rgba(15, 23, 42, 0.18)",
      },
      colors: {
        brand: {
          950: "#0a122b",
          900: "#0f1a4a",
          700: "#2d4c93",
          500: "#4f71d0",
          300: "#96b8ff",
        },
      },
    },
  },
  plugins: [],
};
