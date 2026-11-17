/// <reference types="vitest/config" />
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';

import type { PluginCreator } from 'postcss';
import type { UserConfig } from 'vite';

// This is the plugin that emulates the behaviour of Tailwind CSS, allowing for
// unused CSS to be purged from the final build.
import postcssPurgecss from '@fullhuman/postcss-purgecss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// The base directory for the source files. This is where the JavaScript and
// CSS files are located. The output directory is where the built files will be
// placed.
const baseUrl = '_resources';
const outputUrl = '_site';

const base = (...p: string[]): string => resolve(__dirname, baseUrl, ...p);
const output = (...p: string[]): string => resolve(__dirname, outputUrl, ...p);

// KaTeX lists WOFF2, WOFF and TTF for every font face. Every browser that
// understands the CSS used here takes WOFF2, so the others are dropped rather
// than emitted (and never downloaded) as three times the files.
const woff2Only: PluginCreator<Record<string, never>> = () => ({
  postcssPlugin: 'woff2-only',
  // `Once`, not a visitor: Vite finds the assets a stylesheet refers to in a
  // `Once` pass of its own, which runs after this one but before any visitor.
  Once(root) {
    root.walkAtRules('font-face', (rule) => {
      rule.walkDecls('src', (decl) => {
        const sources = decl.value.split(/,(?![^(]*\))/).map(source => source.trim());
        const woff2 = sources.filter(source => /woff2/.test(source));
        if (woff2.length > 0 && woff2.length < sources.length) {
          decl.value = woff2.join(', ');
        }
      });
    });
  },
});
woff2Only.postcss = true;

export default defineConfig(({ command }): UserConfig => {
  const isBuild = command === 'build';

  return {
    build: {
      emptyOutDir: false, // managed by Jekyll
      manifest: 'manifest.json',
      minify: isBuild ? 'esbuild' : false,
      outDir: output(),
      rollupOptions: {
        input: {
          app: base('js/app.ts'),
          sw: base('js/sw.ts'),
          style: base('css/style.css'),
          katex: base('css/katex.css'),
        },
        output: {
          entryFileNames: (chunkInfo) => {
            // sw.js is a special case that should not be hashed and must be
            // served from the root of the site.
            if (chunkInfo.name === 'sw') {
              return 'sw.js';
            }
            return 'js/[name]-[hash].js';
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.names && assetInfo.names.some(name => name.endsWith('.css'))) {
              return 'css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
        treeshake: isBuild,
      },
      sourcemap: !isBuild,
    },
    css: {
      postcss: {
        plugins: [
          postcssImport(),
          // Cascade layers (Baseline 2022) and light-dark() (Baseline 2024) are
          // used natively, so their polyfills are switched off. The
          // cascade-layers polyfill in particular rewrites selectors with
          // `:not(#\#)` (one ID of specificity each), which makes every layered
          // rule outrank unlayered CSS and defeats the purpose of layers.
          postcssPresetEnv({
            stage: 0,
            features: {
              'cascade-layers': false,
              'light-dark-function': false,
            },
          }),
          autoprefixer,
          woff2Only({}),
          postcssPurgecss({
            // Classes can appear in templates and in raw HTML inside Markdown
            // posts, so both are scanned.
            content: [
              '**/*.html',
              '**/*.md',
              '!_site/**',
              '!node_modules/**',
              '!.direnv/**',
              '!.jekyll-cache/**',
            ],
            defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
            // Jekyll generates article HTML from Markdown after this runs, so
            // none of what Markdown produces appears in the files scanned
            // above: its elements, and the classes Rouge, kramdown and KaTeX
            // add.
            safelist: {
              standard: [
                'blockquote', 'code', 'em', 'figcaption', 'figure', 'hr', 'img',
                'kbd', 'li', 'ol', 'pre', 'strong', 'sub', 'sup', 'table',
                'tbody', 'td', 'th', 'thead', 'tr', 'ul',
              ],
              greedy: [/footnote/, /highlight/, /katex/],
            },
          }),
        ],
      },
    },
    // This is used to define global constants that can be replaced at build
    // time. Typically this will include feature flags.
    define: {
      '__ENABLE_CACHE__': JSON.stringify(isBuild),
    },
    // Remove debugging statements and legal comments in production builds.
    esbuild: isBuild ? {
      drop: ['debugger'],
      legalComments: 'none',
    } : undefined,
    resolve: {
      alias: {
        '@': base('js'),
      },
      // pnpm links packages from a shared store that can sit outside this
      // project. By default Vite follows the link, so a font's manifest key
      // becomes a path into that store (`../../node_modules/.pnpm/...`) rather
      // than `node_modules/@fontsource/...`, which is what `vite_asset_path`
      // in the layout asks for.
      preserveSymlinks: true,
    },
    // Unit tests. Vitest reads this same file, so tests resolve `@/` and
    // everything else exactly as the application does.
    test: {
      environment: 'jsdom',
      // `describe`, `it` and `expect` without imports.
      globals: true,
      // Only the project's own sources hold tests. The project root also holds
      // .direnv, where installed gems ship JavaScript fixtures.
      include: ['_resources/**/*.test.ts'],
    },
    server: {
      watch: {
        // Jekyll generates files in the _site directory, so these should be
        // ignored by Vite's dev server.
        ignored: ['!**/*.html', '_site/**'],
      },
    },
  };
});
