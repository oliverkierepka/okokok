const StyleDictionary = require('style-dictionary').extend(
	'./style-dictionary.config.js'
);

console.log('Build started...');
console.log('\n==============================================');

// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionary.buildAllPlatforms();

console.log('\n==============================================');
console.log('\nBuild completed!');
