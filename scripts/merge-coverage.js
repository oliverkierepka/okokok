const { asyncCopyTo, asyncExecuteCommand } = require('./utils');
const debug = require('debug')('merge-coverage'); // debug(...) will only not swallow the message, if the env variable DEBUG contains the string "merge-coverage"

async function combineReports() {
	try {
		debug('copying reports to "reports" folder...');
		await asyncCopyTo(
			'coverage/cypress/coverage-final.json',
			'reports/from-cypress.json'
		);
		await asyncCopyTo(
			'coverage/jest/coverage-final.json',
			'reports/from-jest.json'
		);
		debug('merging...');
		debug(await asyncExecuteCommand('nyc merge reports'));
		debug('moving report to .nyc_output');
		await asyncCopyTo('coverage.json', '.nyc_output/out.json');
		debug('generating report...');
		// ToDo: check whether lcov reporter was fixed and can read the merged coverage
		console.log(
			await asyncExecuteCommand(
				'nyc report --reporter text --report-dir coverage/total'
			)
		);
	} catch (err) {
		console.log('there has been an error! ', err);
	}
}

combineReports();
