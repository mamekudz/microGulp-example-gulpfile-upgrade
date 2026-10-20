import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ValidateConfig } from '../src/Config.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(await readFile(resolve(ROOT, 'recipe.config.json'), 'utf8'));
ValidateConfig(config);
JSON.parse(await readFile(resolve(ROOT, 'recipe.schema.json'), 'utf8'));
const projectConfig = JSON.parse(await readFile(resolve(ROOT, 'microgulp.config.json'), 'utf8'));
if (!projectConfig.project || !projectConfig.project.title?.trim() || !projectConfig.project.description?.trim() || projectConfig.project.logo !== './assets/microgulp-logo.png') throw new Error('microgulp.config.json needs the example title, description and bundled logo.');
await readFile(resolve(ROOT, projectConfig.project.logo), 'binary');
const release = JSON.parse(await readFile(resolve(ROOT, 'RELEASES.json'), 'utf8'));
const sourceFiles = ['gulpfile.mjs', 'src/Tasks.mjs'];
const markedStrings = [];
for (const file of sourceFiles) {
	const source = await readFile(resolve(ROOT, file), 'utf8');
	for (const match of source.matchAll(/(['"])([^'"\r\n]*?<context="[^"]+"\/>)(\1)/g)) markedStrings.push(match[2]);
}
for (const entry of release.releases) markedStrings.push(...entry.info);
for (const locale of ['en-US', 'de-DE']) {
	const dictionary = JSON.parse(await readFile(resolve(ROOT, 'i18x/gulp', locale + '.json'), 'utf8'));
	for (const key of markedStrings) {
		if (typeof dictionary[key] !== 'string') throw new Error('Missing ' + locale + ' translation: ' + key);
		const placeholders = value => [...value.matchAll(/<([A-Za-z][A-Za-z0-9]*)\/>/g)].map(match => match[0]).sort().join('|');
		if (placeholders(key) !== placeholders(dictionary[key])) throw new Error('Placeholder mismatch in ' + locale + ': ' + key);
	}
}
console.log('Configuration files are valid.');
