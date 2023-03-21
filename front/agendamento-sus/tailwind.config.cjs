/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [ './index.html', './src/**/*.{js,ts,jsx,tsx}' ],
	theme: {
		fontFamily: {
			body: [ 'Inter', 'sans-serif' ]
		},
		extend: {
			colors: {
				'primary-base': '#023E84',
				'primary-dark': '#002C5C',
				'primary-light': '#0061D0',
				'primary-base-alt': '#01499B',
				'yellow-warning': '#FF9922',
				'red-error': '#FF5858',
				'black-base': '#303030'
			},
			backgroundImage: {
				'login-bg': "url('/src/assets/fundo-login.svg')"
			}
		}
	},
	plugins: []
};
