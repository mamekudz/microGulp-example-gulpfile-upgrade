import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import * as Api from 'gulp-mu-gulp-api';
import { BuildSite } from './BuildSite.mjs';

Api.InstallStringExtensions();

export async function RunBuildTask(_root, _config, _api) {
	let outputDirectory = _config.outputDirectory;
	if (_config.features.destinationForm && _api.IsMicroGulp()) {
		const values = await _api.RequestForm({
			title: 'Build options<context="form title"/>'.i18xRegister(),
			submitLabel: 'Build<context="form submit"/>'.i18xRegister(),
			fields: [{ id: 'outputDirectory', type: 'text', label: 'Output folder<context="form label"/>'.i18xRegister(), default: outputDirectory }],
		});
		if (values === null) return null;
		if (typeof values.outputDirectory !== 'string' || !values.outputDirectory.trim()) throw new Error('Output folder cannot be empty.');
		outputDirectory = values.outputDirectory.trim();
	}
	return BuildSite(_root, outputDirectory);
}

export async function RunVerifyTask(_root, _config) {
	const output = resolve(_root, _config.outputDirectory, 'index.html');
	await access(output);
	return output;
}
