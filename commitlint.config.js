// Checks commit messages locally with the same rules as the PR checks.
// The types and scopes live in .github/conventions.json; see docs/guides/workflow.md#commit-messages.
// Turn the hook on once per clone with `pnpm hooks:install`.
import { readFileSync } from 'node:fs';

const conventions = JSON.parse(
  readFileSync(new URL('./.github/conventions.json', import.meta.url), 'utf8'),
);

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', Object.keys(conventions.types)],
    'scope-enum': [2, 'always', Object.keys(conventions.scopes)],
    'header-max-length': [2, 'always', 72],
  },
};
