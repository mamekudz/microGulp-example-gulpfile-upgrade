import { readFileSync } from 'node:fs';
import { resolve, relative, isAbsolute, sep } from 'node:path';

const ALLOWED_TOP = new Set(['schemaVersion', 'outputDirectory', 'features']);

export function ValidateConfig(_value) {
	if (!_value || typeof _value !== 'object' || Array.isArray(_value)) throw new Error('Configuration must be a JSON object.');
	for (const key of Object.keys(_value)) if (!ALLOWED_TOP.has(key)) throw new Error('Unknown configuration key: ' + key);
	if (_value.schemaVersion !== 1) throw new Error('Unsupported configuration schemaVersion.');
	if (typeof _value.outputDirectory !== 'string' || !_value.outputDirectory.trim() || _value.outputDirectory.includes('\\')) throw new Error('outputDirectory must be a nonempty relative path using forward slashes.');
	const output = resolve('/recipe-root', _value.outputDirectory);
	const rel = relative('/recipe-root', output);
	if (isAbsolute(_value.outputDirectory) || rel === '..' || rel.startsWith('..' + sep)) throw new Error('outputDirectory must remain inside the project.');
	if (!_value.features || typeof _value.features !== 'object' || Array.isArray(_value.features)) throw new Error('features must be an object.');
	for (const key of Object.keys(_value.features)) if (!['destinationForm', 'keyboardShortcuts'].includes(key)) throw new Error('Unknown feature: ' + key);
	for (const key of ['destinationForm', 'keyboardShortcuts']) if (typeof _value.features[key] !== 'boolean') throw new Error('Feature ' + key + ' must be a boolean.');
	return { schemaVersion: 1, outputDirectory: _value.outputDirectory.trim(), features: { ..._value.features } };
}

export function LoadConfig(_root) {
	const config = JSON.parse(readFileSync(resolve(_root, 'recipe.config.json'), 'utf8').replace(/^\uFEFF/, ''));
	return ValidateConfig(config);
}
