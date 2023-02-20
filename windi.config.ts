/*
 ** Windi CSS Configuration File
 **
 ** Docs: https://next.windicss.org/guide/configuration.html
 */
import { defineConfig } from "windicss/helpers";

export default defineConfig({
  preflight: true,
  extract: {
    include: ["**/*.{vue,html,jsx,tsx}"],
    exclude: ["node_modules", ".git"],
  },
  theme: {
    extend: {
      screens: {
        "3xl": { max: "1600px" },
      },
    },
  },
  shortcuts: {
    // 'btn': 'py-2 px-4 font-semibold rounded-lg shadow-md',
  },
  plugins: [],
});
