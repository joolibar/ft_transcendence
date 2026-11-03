import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '**/src/generated/**'] },
  js.configs.recommended,
  // Type-aware rules: they use TypeScript's types to find real bugs (promises
  // nobody awaits, values that may be undefined, unsafe `any`).
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          // Root config files are not part of any workspace tsconfig.
          allowDefaultProject: ['*.js', '*.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Plain JavaScript has no types to check.
    files: ['**/*.{js,cjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
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
