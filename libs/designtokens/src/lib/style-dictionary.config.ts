const fs = require('fs');
const path = require('node:path');
const _ = require('lodash');
const Color = require('tinycolor2');
const StyleDictionary = require('style-dictionary');
console.log(__dirname);
const tokens = require('./../../tokens');

import DesignToken = require('style-dictionary/types/DesignToken');
import Dictionary = require('style-dictionary/types/Dictionary');
import AttributeTransform = require('style-dictionary/types/Transform');
import TransformedToken = require('style-dictionary/types/TransformedToken');

const transformer = StyleDictionary.transform['attribute/cti'].transformer;

type CTI = {
	category: string;
	type: string;
	item?: string;
	subitem?: string;
	state?: string;
	[key: string]: string | undefined;
};

type PropertiesToCTI = {
	[key: string]: CTI;
};

type FontExtensionsList = {
	[key: string]: string;
};

const propertiesToCTI: PropertiesToCTI = {
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
const prefix = 'ok';

const CTITransform: AttributeTransform.AttributeTransform = {
	type: `attribute`,
	transformer: (prop: TransformedToken.TransformedToken) => {
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

StyleDictionary.registerTransform({
	name: 'attribute/font',
	type: 'attribute',
	transformer: (prop: TransformedToken.TransformedToken) => ({
		category: prop.path[0],
		type: prop.path[1],
		family: prop.path[2],
		weight: prop.path[3],
		style: prop.path[4],
	}),
});
StyleDictionary.registerFilter({
	name: 'isColor',
	matcher: (token: DesignToken.DesignToken) => {
		return token?.attributes?.category === 'color';
	},
});
StyleDictionary.registerFormat({
	name: 'custom/format/scss',
	formatter: _.template(
		fs.readFileSync(__dirname + '/templates/web-scss.template')
	),
});

// Register a custom format to generate @font-face rules.
StyleDictionary.registerFormat({
	name: 'font-face',
	formatter: ({ dictionary: { allTokens }, options }: any) => {
		const fontPathPrefix = options.fontPathPrefix || '../';

		// https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src
		const formatsMap: FontExtensionsList = {
			woff2: 'woff2',
			woff: 'woff',
			ttf: 'truetype',
			otf: 'opentype',
			svg: 'svg',
			eot: 'embedded-opentype',
		};

		return allTokens
			.reduce((fontList: any, prop: any) => {
				const {
					attributes: { family, weight, style },
					formats,
					value: path,
				} = prop;

				const urls = formats.map(
					(extension: string) =>
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

module.exports = {
	source: ['tokens/**/*.json'],
	transform: {
		// Override the attribute/cti transform
		'attribute/cti': CTITransform,
		// Set a mathcer for colors in color/sketch
		'color/sketch': {
			type: 'value',
			matcher: (prop: DesignToken.DesignToken) => {
				return prop.attributes?.category === 'color';
			},
			transformer: function (prop: TransformedToken.TransformedToken) {
				const color = Color(prop.original.value).toRgb();
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
		'sketch/palette': function (dictionary: Dictionary.Dictionary) {
			const to_ret = {
				compatibleVersion: '2.0',
				pluginVersion: '2.2',
				colors: dictionary.allProperties.map(function (
					prop: DesignToken.DesignToken
				) {
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
			buildPath: path.join(__dirname, './build/css/'),
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
			buildPath: path.join(__dirname, './build/scss/'),
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
		// Web output in css format
		css: {
			prefix: 'ok',
			transforms: [
				'attribute/cti',
				'name/cti/kebab',
				'time/seconds',
				'content/icon',
				'size/rem',
				'color/hsl',
			],
			buildPath: path.join(__dirname, './build/'),
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
			buildPath: path.join(__dirname, './build/scss/'),
			files: tokens.map((tokenCategory: string) => ({
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
			buildPath: path.join(__dirname, './build/'),
			files: [
				{
					destination: 'style-dictionary.sketch',
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
