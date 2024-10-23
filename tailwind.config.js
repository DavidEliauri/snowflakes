/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.pug"],
    theme: {
        extend: {
            fontFamily: {
                garamond: ["EB Garamond", "serif"],
                montserrat: ["Montserrat", "sans-serif"],
            },
            container: {
                padding: "1rem",
                center: true,
            },
            colors: {
                "roots-beige": "#7A7367",
                "roots-beige-light": "#BAAFA6",
                "roots-beige-lighter": "#D3C7BA",
                "roots-black": "#111111",
                "roots-grey": "#8C8C8C",
                "roots-grey-light": "#EAEAEA",
                "roots-blue": "#002469",
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("@tailwindcss/aspect-ratio"),
    ],
};
