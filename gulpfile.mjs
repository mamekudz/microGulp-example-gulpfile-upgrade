import * as Api from 'gulp-mu-gulp-api';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LoadConfig } from './src/Config.mjs';
import { RunBuildTask, RunVerifyTask } from './src/Tasks.mjs';
import { GetVersionString } from './tools/RecipeRelease.mjs';

Api.InstallStringExtensions();
const ROOT = dirname(fileURLToPath(import.meta.url));
const CONFIG = LoadConfig(ROOT);

export const µI18xContext = { GetValues: () => ({ version: GetVersionString() }) };

// Keep these public export names: existing gulp <TASK> calls remain valid.
export async function BUILD_SITE() {
	return RunBuildTask(ROOT, CONFIG, Api);
}

export async function VERIFY_SITE() {
	return RunVerifyTask(ROOT, CONFIG);
}

BUILD_SITE.µDisplayName = 'Build website V<version/><context="µDisplayName"/>'.i18xRegister();
BUILD_SITE.µDescription = 'Builds the existing website output.<context="µDescription"/>'.i18xRegister();
BUILD_SITE.µGroup = 'Build<context="µGroup"/>'.i18xRegister();
BUILD_SITE.µKeyBinding = { key: 'ctrl+shift+F8', mac: 'cmd+shift+F8' };
VERIFY_SITE.µDisplayName = 'Verify website output<context="µDisplayName"/>'.i18xRegister();
VERIFY_SITE.µDescription = 'Checks the output from the existing build task.<context="µDescription"/>'.i18xRegister();
VERIFY_SITE.µGroup = BUILD_SITE.µGroup;
VERIFY_SITE.µKeyBinding = { key: 'ctrl+shift+F9', mac: 'cmd+shift+F9' };
