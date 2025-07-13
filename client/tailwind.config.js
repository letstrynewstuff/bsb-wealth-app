/** @type {import('tailwindcss').Config} */
export const content = ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
    extend: {
        fontFamily: {
            roboto: ["Roboto", "sans-serif"],
            opensans: ["Open Sans", "sans-serif"],
            poppins: ["Poppins", "sans-serif"],
        },
    },
};
export const plugins = [];
