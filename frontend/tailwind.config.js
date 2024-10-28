/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				clio_color: "#0070E0",
				dark_green: "#27521b",
				link_color: "#1a237e",
			},
		},
	},
	plugins: [],
};
