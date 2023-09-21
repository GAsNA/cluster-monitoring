// tailwind.config.js
const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        "base": {
          extend: "dark", // <- inherit default values from dark theme
          colors: {
            background: "#000000",
            foreground: "#ffffff",
            primary: {
              DEFAULT: "#01babc",
              foreground: "#ffffff",
            },
	   secondary: {
              DEFAULT: "#c1c1c9",
              foreground: "#ffffff",
	   },
	   success: {
              DEFAULT: "#2cd57a",
              foreground: "#ffffff",
	   },
	   danger: {
              DEFAULT: "#e96a64",
              foreground: "#ffffff",
	   },
	   warning: {
              DEFAULT: "#f4a723",
              foreground: "#ffffff",
	   },
	   info: {
              DEFAULT: "#4990e2",
              foreground: "#ffffff",
	   },
	   light: {
              DEFAULT: "#e7e7e7",
              foreground: "#ffffff",
	   },
	   dark: {
              DEFAULT: "#5c5b61",
              foreground: "#ffffff",
	   },
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
      },
    }),
  ],
};
