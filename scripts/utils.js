const ncp = require('ncp').ncp;
const mkdirp = require('mkdirp');
const path = require('path');
const exec = require('child_process').exec;

function asyncMkDirP(filepath) {
	return new Promise((resolve, reject) =>
		mkdirp(filepath, (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		})
	);
}

function asyncCopyTo(from, to) {
	return asyncMkDirP(path.dirname(to)).then(
		() =>
			new Promise((resolve, reject) => {
				ncp(from, to, (error) => {
					if (error) {
						// Wrap to have a useful stack trace.
						reject(new Error(error));
						return;
					}
					resolve();
				});
			})
	);
}

function asyncExecuteCommand(command) {
	return new Promise((resolve, reject) =>
		exec(command, (error, stdout) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(stdout);
		})
	);
}

module.exports = {
	asyncCopyTo,
	asyncExecuteCommand,
	asyncMkDirP,
};
