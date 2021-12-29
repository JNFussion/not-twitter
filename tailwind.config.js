// eslint-disable-next-line import/no-extraneous-dependencies
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
      gridTemplateColumns: {
        layout: "1fr 2fr 1fr",
        "1fr-auto-1fr": "1fr auto 1fr",
      },
    },
  },
  plugins: [],
};
