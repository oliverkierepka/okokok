const StyleDictionary = require('style-dictionary');
const Color = require('tinycolor2');
const tokens = require('./tokens');

const transformer = StyleDictionary.transform['attribute/cti'].transformer;

const propertiesToCTI = {
	width: { category: 'size', type: 'dimension' },
	'min-width': { category: 'size', type: 'dimension' },
	'max-width': { category: 'size', type: 'dimension' },
	height: { category: 'size', type: 'dimension' },
	'min-height': { category: 'size', type: 'dimension' },
	'max-height': { category: 'size', type: 'dimension' },
	'border-width': { category: 'size', type: 'border', item: 'width' },
	'border-radius': { category: 'size', type: 'border', item: 'width' },
	'border-color': { category: 'color', type: 'border' },
	'background-color': { category: 'color', type: 'background' },
	color: { category: 'color', type: 'font' },
	'text-color': { category: 'color', type: 'font' },
	padding: { category: 'size', type: 'padding' },
	'padding-vertical': { category: 'size', type: 'padding' },
	'padding-horizontal': { category: 'size', type: 'padding' },
	icon: { category: 'content', type: 'icon' },
	'font-size': { category: 'size', type: 'font' },
	'line-height': { category: 'size', type: 'line-height' },
	size: { category: 'size', type: 'icon' },
};
const prefix = 'rh';

const CTITransform = {
	type: `attribute`,
	transformer: (prop) => {
		// Only do this custom functionality in the 'component' top-level namespace.
		if (prop.path[0] === 'component') {
			// When defining component tokens, the key of the token is the relevant CSS property
			// The key of the token is the last element in the path array
			return propertiesToCTI[prop.path[prop.path.length - 1]];
		} else {
			// Fallback to the original 'attribute/cti' transformer
			return transformer(prop);
		}
	},
};
module.exports = {
	source: ['tokens/**/*.json'],
	transform: {
		// Override the attribute/cti transform
		'attribute/cti': CTITransform,
		// Set a mathcer for colors in color/sketch
		'color/sketch': {
			type: 'value',
			matcher: (prop) => {
				return prop.attributes.category === 'color';
			},
			transformer: function (prop) {
				let color = Color(prop.original.value).toRgb();
				return {
					red: (color.r / 255).toFixed(2),
					green: (color.g / 255).toFixed(2),
					blue: (color.b / 255).toFixed(2),
					alpha: color.a,
				};
			},
		},
	},
	format: {
		'sketch/palette': function (dictionary) {
			var to_ret = {
				compatibleVersion: '2.0',
				pluginVersion: '2.2',
				colors: dictionary.allProperties.map(function (prop) {
					// Merging the token's value, which should be an object with r,g,b,a channels
					return Object.assign(
						{
							name: prop.name,
						},
						prop.value
					);
				}),
			};
			return JSON.stringify(to_ret, null, 2);
		},
	},
	platforms: {
		'css-font-face': {
			transforms: ['attribute/font'],
			buildPath: 'build/css/',
			files: [
				{
					destination: 'fonts.css',
					format: 'font-face',
					filter: {
						attributes: {
							category: 'asset',
							type: 'font',
						},
					},
					options: {
						fontPathPrefix: '../assets/',
					},
				},
			],
		},
		'scss-font-face': {
			transforms: ['attribute/font'],
			buildPath: 'build/scss/',
			files: [
				{
					destination: '_fonts.scss',
					format: 'font-face',
					filter: {
						attributes: {
							category: 'asset',
							type: 'font',
						},
					},
					options: {
						fontPathPrefix: '#{$font-path}/',
					},
				},
			],
		},
		'esm/category': {
			prefix,
			buildPath: 'build/js/esm/',
			transforms: [
				'attribute/cti',
				'name/cti/camel',
				'size/px',
				'color/hex',
			],
			files: tokens.map((tokenCategory) => ({
				destination: `${tokenCategory}.js`,
				format: 'javascript/es6',
				filter: {
					attributes: {
						category: tokenCategory,
					},
				},
			})),
		},
		'esm/index': {
			prefix,
			buildPath: 'build/js/esm/',
			transforms: [
				'attribute/cti',
				'name/cti/camel',
				'size/px',
				'color/hex',
			],
			files: [
				{
					destination: `index.js`,
					format: 'javascript/es6',
				},
			],
		},
		'cjs/category': {
			prefix,
			buildPath: 'build/js/cjs/',
			transforms: [
				'attribute/cti',
				'name/cti/camel',
				'size/px',
				'color/hsl',
			],
			files: tokens.map((tokenCategory) => ({
				destination: `${tokenCategory}.js`,
				format: 'custom/cjsmodule',
				filter: {
					attributes: {
						category: tokenCategory,
					},
				},
			})),
		},
		'cjs/index': {
			prefix,
			buildPath: 'build/js/cjs/',
			transforms: [
				'attribute/cti',
				'name/cti/camel',
				'size/px',
				'color/hex',
			],
			files: [
				{
					destination: `index.js`,
					format: 'custom/cjsmodule',
				},
			],
		},

		// Web output in scss format

		css: {
			prefix: 'rh',
			transforms: [
				'attribute/cti',
				'name/cti/kebab',
				'time/seconds',
				'content/icon',
				'size/rem',
				'color/hsl',
			],
			buildPath: `build/`,
			files: [
				{
					destination: `css/tokens.css`,
					format: 'css/variables',
					options: {
						outputReferences: true,
					},
				},
				{
					destination: `scss/tokens.scss`,
					format: 'custom/format/scss',
					options: {
						outputReferences: true,
					},
				},
				{
					destination: 'scss/map.scss',
					format: 'scss/map-deep',
					mapName: 'my-tokens',
				},
			],
		},
		// Web output in scss partialformat
		'scss/category': {
			prefix,
			transformGroup: 'scss',
			buildPath: `build/scss/`,
			files: tokens.map((tokenCategory) => ({
				destination: `_${tokenCategory}.scss`,
				format: 'custom/format/scss',
				filter: {
					attributes: {
						category: tokenCategory,
					},
				},
			})),
		},
		sketch: {
			prefix,
			transforms: ['attribute/cti', 'color/sketch', 'name/cti/kebab'],
			buildPath: 'build/',
			files: [
				{
					destination: 'style-dictionary.sketchpalette',
					format: 'sketch/palette',
					filter: {
						attributes: {
							category: 'color',
						},
					},
				},
			],
		},
	},
};

// Register an "attribute" transform to codify the font's details
// as named attributes.
StyleDictionary.registerTransform({
	name: 'attribute/font',
	type: 'attribute',
	transformer: (prop) => ({
		category: prop.path[0],
		type: prop.path[1],
		family: prop.path[2],
		weight: prop.path[3],
		style: prop.path[4],
	}),
});

// Register a custom format to generate @font-face rules.
StyleDictionary.registerFormat({
	name: 'font-face',
	formatter: ({ dictionary: { allTokens }, options }) => {
		const fontPathPrefix = options.fontPathPrefix || '../';

		// https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src
		const formatsMap = {
			woff2: 'woff2',
			woff: 'woff',
			ttf: 'truetype',
			otf: 'opentype',
			svg: 'svg',
			eot: 'embedded-opentype',
		};

		return allTokens
			.reduce((fontList, prop) => {
				const {
					attributes: { family, weight, style },
					formats,
					value: path,
				} = prop;

				const urls = formats.map(
					(extension) =>
						`url("${fontPathPrefix}fonts/${path}.${extension}") format("${formatsMap[extension]}")`
				);

				const fontCss = [
					'@font-face {',
					`\n\tfont-family: "${family}";`,
					`\n\tfont-style: ${style};`,
					`\n\tfont-weight: ${weight};`,
					`\n\tsrc: ${urls.join(',\n\t\t\t ')};`,
					'\n\tfont-display: fallback;',
					'\n}\n',
				].join('');

				fontList.push(fontCss);

				return fontList;
			}, [])
			.join('\n');
	},
});

StyleDictionary.registerFormat({
	name: 'custom/cjsmodule',
	formatter: function ({ dictionary }) {
		return `module.exports = {${dictionary.allTokens.map(
			(token) => `\n\t${token.name}: "${token.value}"`
		)}\n};`;
	},
});
