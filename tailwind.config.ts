import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "ruga-navy": "#1E4176",
        "ruga-royal": "#2456A8",
        "ruga-sky": "#59B9EB",
        "palm-light": "#5FD4B4",
        "palm-deep": "#2FB491",
        ink: "#06101F",
        paper: "#F6FAFD",
        line: "#DCE7F2",
        danger: "#E05260",
        amber: { star: "#F5B942" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        btn: "12px",
        card: "16px",
        "card-lg": "20px",
        chip: "999px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(6,16,31,0.05)",
        lift: "0 12px 32px rgba(6,16,31,0.10)",
      },
    },
  },
  plugins: [],
};
export default config;
