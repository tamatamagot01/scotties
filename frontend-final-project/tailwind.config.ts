/* eslint-disable @typescript-eslint/no-require-imports */
import { nextui } from "@nextui-org/theme";

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(calendar|button|ripple|spinner).js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#222222",
        secondary: "#C9EA6E",
        lightSecondary: "#dbf29b",
        darkSecondary: "#98b34d",
        tertiary: "#BFBFBF",
        text: "#fff",
      },
      fontFamily: {
        fredoka: ["var(--font-fredoka)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [nextui(), require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
export default config;
