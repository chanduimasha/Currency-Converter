/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "15px",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
    fontFamily: {
      primary: "var(--font-jetbrainsMono)",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
	  keyframes: {
		"accordion-down": {
		  from: { height: 0 },
		  to: { height: "var(--radix-accordion-content-height)" },
		},
		"accordion-up": {
		  from: { height: "var(--radix-accordion-content-height)" },
		  to: { height: 0 },
		},
		"fadeInSlideUp": {
		  "0%": { opacity: 0, transform: "translateX(20px)" },
		  "100%": { opacity: 1, transform: "translateX(0)" },
		},
	  },
	  animation: {
		"accordion-down": "accordion-down 0.2s ease-out",
		"accordion-up": "accordion-up 0.2s ease-out",
		"fadeInSlideUp": "fadeInSlideUp 1s ease-out",
		'light-stream': 'lightStream 2s linear infinite',
		'internal-light-stream': 'internalLightStream 2s linear infinite'
	  },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
