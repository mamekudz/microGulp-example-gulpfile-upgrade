# µGulp Recipe: Upgrade an Existing Gulpfile

This is a small existing Gulp project with two stable task exports: `BUILD_SITE` and `VERIFY_SITE`. The recipe adds µGulp display names, descriptions, groups, keyboard shortcuts, a project title/logo and an optional output-directory form. The standard Gulp CLI still exposes the same task names and does not prompt for a dashboard form.

## Requirements and install

- Node.js 22 or newer
- Gulp 5.0.1
- `gulp-mu-gulp-api` 0.8.0, bundled through the local package archive
- A compatible µGulp host is needed only to see dashboard metadata and the optional form

Run `npm ci`, then `npm test` and `npm run check`. In the normal Gulp CLI, use `npm run tasks`, `npm run build` and `npm run verify`. The build writes only this example's `dist/index.html`.

## Configuration

`recipe.config.json` controls the output folder and two optional UI features. The JSON schema is `recipe.schema.json`; `tools/Check.mjs` performs runtime checks and rejects unknown keys, wrong types, unsupported schema versions and paths outside the project. Set `features.destinationForm` or `features.keyboardShortcuts` to false to turn off those additions.

The µGulp form is shown only when `Api.IsMicroGulp()` is true. Without µGulp, the task uses `outputDirectory` directly. Cancel returns without writing. Form values pass through the same path checks as configured values.

`microgulp.config.json` sets the project title and uses the bundled µGulp logo. The Gulp tasks are intentionally not renamed: `gulp BUILD_SITE` and `gulp VERIFY_SITE` remain the stable entrypoints.

## Adapting an existing project

Inspect task exports and every use in scripts, CI and docs first. Add the API import and direct `µ` properties to the existing function; keep its current body and sequencing. Copy only the optional form pattern if it suits the project. Keep its old CLI behavior as the fallback and test the old commands before accepting the integration.

## Release history

`RELEASES.json` is the single source of the example's own version history. Run `npm run release:check` before tests; after intentionally editing that history, run `npm run release:sync`. This version does not change the versions of the Gulp application being adapted.

## Verification status and limitations

The unit tests use temporary folders. The sample does not run a production build. µGulp IDE rendering, Windows/macOS/Linux, and other µGulp/API release combinations require separate acceptance tests. No remote repository or public release is configured.

<!-- blog-publication:start -->
Artikel: [Deutsch](https://microgulp.dev/de/blog/gulpfile-upgrade/)

Weitere Beispiele: [microGulp-Examples](https://github.com/mamekudz/microGulp-Examples).
<!-- blog-publication:end -->
