# Design Tokens

This is the home of okokok design tokens.
It uses style-dictionary to transform platform independent designtoken.json files to generate platform specific output formats (like scss, css, plist, xml, ...). The configuration is found in config.js

## Design Token Transformer

This repo provides an npm script which is bound to a gitlab action. This action receives a json file exported by figma design-tokens extension and automatically transforms it to the specified platforms and formats.

## What is where?

TODO: need to update this 

```
├── …
├── config.json <--- style-dictionary configuration
├── tokens/ <--- the design-tokens folder (the structure of the subfolders and files follows [style dictionarys CTI paradigmn](https://amzn.github.io/style-dictionary/#/tokens?id=category-type-item))
├── build/ <--- the output folder of style dictionary
├── …
```

## Build

Run `style-dictionary build` to build the design tokens for the defined platforms and formats.

If you open `config.json` you will see there are 2 platforms defined: scss and sketch. Each platform has a transformGroup, buildPath, and files. The buildPath and files of the platform should match up to the files what were built. The files built should look like these:

**SCSS**

```scss
// variables.scss
$color-base-gray-light: #cccccc;
$color-base-gray-medium: #999999;
$color-base-gray-dark: #111111;
$color-base-red: #ff0000;
$color-base-green: #00ff00;
$color-font-base: #ff0000;
$color-font-secondary: #00ff00;
$color-font-tertiary: #cccccc;
$size-font-small: 0.75rem;
$size-font-medium: 1rem;
$size-font-large: 2rem;
$size-font-base: 1rem;
```

Pretty nifty! This shows a few things happening:

1. The build system does a deep merge of all the token JSON files defined in the `source` attribute of `config.json`. This allows you to split up the token JSON files however you want. There are 2 JSON files with `color` as the top level key, but they get merged properly.
2. The build system resolves references to other design tokens. `{size.font.medium.value}` gets resolved properly.
3. The build system handles references to token values in other files as well as you can see in `tokens/color/font.json`.

Now let's make a change and see how that affects things. Open up `tokens/color/base.json` and change `"#111111"` to `"#000000"`. After you make that change, save the file and re-run the build command `style-dictionary build`. Open up the build files and take a look.

**Huzzah!**

Now go forth and create! Take a look at all the built-in [transforms](https://amzn.github.io/style-dictionary/#/transforms?id=pre-defined-transforms) and [formats](https://amzn.github.io/style-dictionary/#/formats?id=pre-defined-formats).
