const { getJestProjects } = require('@nrwl/jest');

export default {
	projects: getJestProjects(),
};

export default {
	moduleNameMapper: {
		'@okokok/components/(.*)': '<rootDir>/libs/components/$1',
		'@okokok/elements/(.*)': '<rootDir>/libs/elements/$1',
	},
};
