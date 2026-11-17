// Makes `describe`, `it`, `expect` and `vi` known to TypeScript in the test
// files. This is a reference rather than `compilerOptions.types` because that
// option would switch off the automatic inclusion of every other `@types`
// package, including the service worker types `sw.ts` relies on.
/// <reference types="vitest/globals" />
