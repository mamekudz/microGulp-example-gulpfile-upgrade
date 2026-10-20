import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { BuildSite, ResolveOutput } from '../src/BuildSite.mjs';
import { ValidateConfig } from '../src/Config.mjs';
import { RunBuildTask } from '../src/Tasks.mjs';

test('configuration rejects unknown keys and paths outside the project', () => {
	const valid = { schemaVersion: 1, outputDirectory: 'dist', features: { destinationForm: true, keyboardShortcuts: true } };
	assert.equal(ValidateConfig(valid).outputDirectory, 'dist');
	assert.throws(() => ValidateConfig({ ...valid, adminCommand: 'del' }), /Unknown configuration key/);
	assert.throws(() => ValidateConfig({ ...valid, outputDirectory: '../outside' }), /inside the project/);
	assert.throws(() => ValidateConfig({ ...valid, features: { ...valid.features, form: 'yes' } }), /Unknown feature/);
	assert.throws(() => ResolveOutput('C:/fixture', '../outside'), /child directory/);
});

test('same BUILD_SITE task works on the CLI path without requesting a form', async _t => {
	const root = await mkdtemp(resolve(tmpdir(), 'gulpfile-upgrade-cli-'));
	_t.after(() => rm(root, { recursive: true, force: true }));
	let formCalls = 0;
	const api = { IsMicroGulp: () => false, RequestForm: async () => { formCalls++; return { outputDirectory: 'elsewhere' }; } };
	const file = await RunBuildTask(root, { outputDirectory: 'dist', features: { destinationForm: true } }, api);
	assert.equal(formCalls, 0);
	assert.equal(await readFile(file, 'utf8').then(text => text.includes('<h1>Existing Gulp build</h1>')), true);
});

test('µGulp form is optional, cancellation is harmless, and values stay inside project', async _t => {
	const root = await mkdtemp(resolve(tmpdir(), 'gulpfile-upgrade-form-'));
	_t.after(() => rm(root, { recursive: true, force: true }));
	let requests = 0;
	const api = { IsMicroGulp: () => true, RequestForm: async () => { requests++; return { outputDirectory: 'chosen' }; } };
	const file = await RunBuildTask(root, { outputDirectory: 'dist', features: { destinationForm: true } }, api);
	assert.match(file, /chosen[\\/]index\.html$/);
	assert.equal(requests, 1);
	const canceled = await RunBuildTask(root, { outputDirectory: 'dist', features: { destinationForm: true } }, { ...api, RequestForm: async () => null });
	assert.equal(canceled, null);
	await assert.rejects(RunBuildTask(root, { outputDirectory: 'dist', features: { destinationForm: true } }, { ...api, RequestForm: async () => ({ outputDirectory: '../outside' }) }), /child directory/);
});

test('legacy task exports remain present with the original identifiers', async () => {
	const gulpfile = await import('../gulpfile.mjs');
	assert.equal(typeof gulpfile.BUILD_SITE, 'function');
	assert.equal(typeof gulpfile.VERIFY_SITE, 'function');
	assert.deepEqual(Object.keys(gulpfile).filter(name => /^[A-Z][A-Z0-9_]*$/.test(name)).sort(), ['BUILD_SITE', 'VERIFY_SITE']);
	assert.equal(gulpfile.BUILD_SITE.µKeyBinding.mac, 'cmd+shift+F8');
});
