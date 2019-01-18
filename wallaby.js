module.exports = function () {
	return {
		files: [
			'app.ts',
			'src/**/*.ts'
		],

		tests: [
			'test/**/*.test.ts'
		],

		env: {
			type: 'node'
		},

		setup: function () {
			require('./test/support/env.ts');
		}
	};
};