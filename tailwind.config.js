/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Usar modo 'class' para que funcione con la clase 'dark' en el HTML
    theme: {
        extend: {
            colors: {
                primary: '#f3ba2f',
            }
        },
    },
    plugins: [],
}
