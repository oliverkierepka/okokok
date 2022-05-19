import { Buffer } from 'node:buffer';
import { Url } from 'node:url';
const { readdirSync, statSync, Dirent } = require('fs');
const { join } = require('path');
const dirs = (p: string | Buffer | Url) =>
	readdirSync(p).filter((f: string[] | Buffer | typeof Dirent) =>
		statSync(join(p, f)).isDirectory()
	);
module.exports = dirs(__dirname);
