const StyleDictionary = require('style-dictionary');
const baseConfig = require('./style-dictionary.config');
import { DesignToken } from 'style-dictionary/types/DesignToken';

type AdvancedToken = DesignToken & {
	[key: string]: string | number;
};

StyleDictionary.registerTransform({
	name: 'size/px',
	type: 'value',
	matcher: (token: AdvancedToken) => {
		return (
			(token['unit'] === 'pixel' || token['type'] === 'dimension') &&
			token.value !== 0
		);
	},
	transformer: (token: DesignToken) => {
		return `${token.value}px`;
	},
});

StyleDictionary.registerTransform({
	name: 'size/percent',
	type: 'value',
	matcher: (token: AdvancedToken) => {
		return token['unit'] === 'percent' && token['value'] !== 0;
	},
	transformer: (token: DesignToken) => {
		return `${token.value}%`;
	},
});

StyleDictionary.registerTransformGroup({
	name: 'custom/css',
	transforms: StyleDictionary.transformGroup['css'].concat([
		'size/px',
		'size/percent',
	]),
});

StyleDictionary.registerTransformGroup({
	name: 'custom/scss',
	transforms: StyleDictionary.transformGroup['less'].concat([
		'size/px',
		'size/percent',
	]),
});

StyleDictionary.registerFilter({
	name: 'validToken',
	matcher: function (token: AdvancedToken) {
		return ['dimension', 'string', 'number', 'color'].includes(
			token['type']
		);
	},
});

const StyleDictionaryExtended = StyleDictionary.extend(baseConfig);

StyleDictionaryExtended.buildAllPlatforms();
