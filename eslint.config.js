import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '**/src/generated/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: [
      'apps/api/**/*.ts',
      'packages/shared/**/*.ts',
      '*.js',
      'apps/*/*.ts',
      '.github/**/*.cjs',
    ],
    languageOptions: { globals: globals.node },
  },
  {
    // GitHub Actions scripts are CommonJS because actions/github-script loads them with require().
    files: ['.github/**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
);
