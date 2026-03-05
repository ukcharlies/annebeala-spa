import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          graphite: "#2C302E",
          olive: "#8F857D",
          tea: "#C9F2C2",
          porcelain: "#FAFDF7",
          forest: "#409E05",
        },
      },
    },
  },
  plugins: [],
};
export default config;
