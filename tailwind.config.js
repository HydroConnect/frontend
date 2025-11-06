/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,ts,jsx,tsx}", "./app/**/*.{html,js}", "./src/**/*.{js,ts,jsx,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                sans: ["SourceSansPro-Regular"],
                "sans-semibold": ["SourceSansPro-Semibold"],
            },
            fontSize: {
                d1: ["57px", "64px"], // Display/D1
                d2: ["45px", "52px"], // Display/D2
                h1: ["32px", "40px"], // Heading/H1
                h2: ["28px", "36px"], // Heading/H2
                h3: ["24px", "32px"], // Heading/H3
                title: ["18px", "24px"], // Title
                body: ["16px", "24px"], // Body
                label: ["14px", "20px"], // Label (Lable di gambar)
                c1: ["12px", "16px"], // Caption/C1
                c2: ["11px", "13px"], // Caption/C2
            },
            // --- INI BAGIAN YANG SAYA GANTI ---
            colors: {
                white: "#FFFFFF",
                black: "#000000",
                yellow: {
                    DEFAULT: "#F9B72B", // 5
                    50: "#FEFBEA", // 0.5
                    100: "#FEF1D5", // 1
                    150: "#FDE9BF", // 1.5
                    200: "#FDE2AA", // 2
                    300: "#FBD480", // 3
                    400: "#FAC555", // 4
                    500: "#F9B72B", // 5
                    600: "#C79222", // 6
                    700: "#956E1A", // 7
                    800: "#644911", // 8
                    850: "#48370D", // 8.5
                    900: "#322509", // 9
                    950: "#191204", // 9.5
                },
                red: {
                    DEFAULT: "#FC5859", // 5
                    50: "#FFEEEE", // 0.5
                    100: "#FEDEDE", // 1
                    150: "#FECDCD", // 1.5
                    200: "#FEBCBD", // 2
                    300: "#FD989B", // 3
                    400: "#FD797A", // 4
                    500: "#FC5859", // 5
                    600: "#D24747", // 6
                    700: "#A83536", // 7
                    800: "#7F2424", // 8
                    850: "#6A181B", // 8.5
                    900: "#551213", // 9
                    950: "#400A0A", // 9.5
                    975: "#2B0101", // 10 (Ini khusus ada di 'red')
                },
                blue: {
                    DEFAULT: "#0A4D91", // 5
                    50: "#CBE1FB", // 0.5
                    100: "#B5D2F0", // 1
                    150: "#9FB5DB", // 1.5
                    200: "#7CA6D1", // 2
                    300: "#5688B8", // 3
                    400: "#306BA6", // 4
                    500: "#0A4D91", // 5
                    600: "#083E74", // 6
                    700: "#062E57", // 7
                    800: "#041F3A", // 8
                    850: "#03172C", // 8.5
                    900: "#020F1D", // 9
                    950: "#01080F", // 9.5
                },
                green: {
                    DEFAULT: "#3B6850", // 5
                    50: "#E0EEE6", // 0.5
                    100: "#D0E1D7", // 1
                    150: "#AFC7B9", // 1.5
                    200: "#9EBAAA", // 2
                    300: "#7D9F8C", // 3
                    400: "#5C856E", // 4
                    500: "#3B6850", // 5
                    600: "#2F5640", // 6
                    700: "#234030", // 7
                    800: "#182B20", // 8
                    850: "#122018", // 8.5
                    900: "#0C1510", // 9
                    950: "#060B08", // 9.5
                },
            },
            // --- AKHIR DARI BAGIAN YANG SAYA GANTI ---
        },
    },
    plugins: [],
    safelist: [],
};
