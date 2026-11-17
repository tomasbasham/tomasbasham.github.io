import globals from 'globals';
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

import type { Linter } from 'eslint';

const commonRules: Record<string, Linter.RuleEntry> = {
  quotes: ['error', 'single'],
  'comma-dangle': ['error', 'always-multiline'],
  semi: ['error', 'always'],
};

export default [
  {
    // Global settings that apply to all files
    languageOptions: {
      globals: {
        process: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  // Browser files (default)
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...commonRules,
    },
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': typescript,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        process: true,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...typescript.configs.recommended.rules,
      // Disable JavaScript-specific rules that conflict with TypeScript
      '@typescript-eslint/no-unused-vars': 'error',
      'no-unused-vars': 'off',
      ...commonRules,
    },
  },
  // Node-specific files
  {
    files: [
      'esbuild.config.js',
      'eslint.config.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
] as const satisfies Linter.Config[];
