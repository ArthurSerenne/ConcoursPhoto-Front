/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'regal-grey': '#A8A8A8',
                'button-grey': '#F5F5F5',
            },
            gap: {
                '30': '30px',
                '35': '35px',
            },
            fontSize: {
                xs: ['12px', '15px'],
                sm: ['14px', '17px'],
                'text-2xl': ['24px', '29px'],
            },
        },
    },
    plugins: [],
};
