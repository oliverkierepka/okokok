const { getJestProjects } = require('@nrwl/jest');

module.exports = {
	projects: getJestProjects(),
};

module.exports = {
	moduleNameMapper: {
		'@rhenag/components/(.*)': '<rootDir>/libs/components/$1',
		'@rhenag/elements/(.*)': '<rootDir>/libs/elements/$1',
	},
};
