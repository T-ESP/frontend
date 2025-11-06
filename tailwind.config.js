/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        primaryBg: "var(--color-primary-bg)",
        primaryPlus: "var(--color-primary-plus)",
        primaryDark: "var(--color-primary-dark)",
        primaryDeep: "var(--color-primary-deep)",
        primaryNight: "var(--color-primary-night)",
        neutral900: "var(--color-neutral-900)",
        neutral700: "var(--color-neutral-700)",
        border: "var(--color-border)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)"
      }
    }
  },
  plugins: []
}
