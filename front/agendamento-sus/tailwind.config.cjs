/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [ './index.html', './src/**/*.{js,ts,jsx,tsx}' ],
	theme: {
		extend: {
			colors: {
				'primary-base': '#023E84',
				'primary-dark': '#002C5C',
				'yellow-warning': '#FF9922',
				'red-error': '#FF5858',
				'black-base': '#303030'
			}
		}
	},
	plugins: []
};
