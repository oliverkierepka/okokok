const StyleDictionary = require('style-dictionary').extend(
	__dirname + '/style-dictionary.config.ts'
);

console.log('Build started...');
console.log('\n==============================================');

// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionary.buildAllPlatforms();

console.log('\n==============================================');
console.log('\nBuild completed!');
