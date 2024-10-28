/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				clio_color: "#137DE8",
				dark_green: "#387d39",
				link_color: "#0044ff",
			},
		},
	},
	plugins: [],
};
