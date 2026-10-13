# Dependency provenance

Only runtime dependency: official Grist Custom Widget API, vendored unchanged from https://docs.getgrist.com/grist-plugin-api.js on 2026-10-12. License: Apache-2.0 (vendor/LICENSE-grist.txt); bundled dependency notices remain in the original JavaScript.

The upstream artifact uses webpack development eval wrappers. CSP permits unsafe-eval for this pinned, local file; project code does not use eval. No runtime CDN requests. Review and retest before changing this dependency. The SDK exposes more APIs than this widget uses; app.js calls only ready, onOptions, onRecords and mapColumnNames, and requests read table.

There is no ANUPRESS runtime or nested widget relay in this package.
