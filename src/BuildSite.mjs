import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';

export function ResolveOutput(_root, _outputDirectory) {
	const root = resolve(_root);
	const output = resolve(root, _outputDirectory);
	const rel = relative(root, output);
	if (!rel || rel === '..' || rel.startsWith('..' + sep) || resolve(rel) === resolve('.')) throw new Error('Build output must be a child directory of the project.');
	return output;
}

export async function BuildSite(_root, _outputDirectory) {
	const output = ResolveOutput(_root, _outputDirectory);
	const file = resolve(output, 'index.html');
	await mkdir(dirname(file), { recursive: true });
	await writeFile(file, '<!doctype html><html lang="en"><meta charset="utf-8"><title>Existing Gulp build</title><h1>Existing Gulp build</h1>\n', 'utf8');
	return file;
}
