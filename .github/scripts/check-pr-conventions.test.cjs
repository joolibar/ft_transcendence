const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { branchProblems, titleProblems } = require('./check-pr-conventions.cjs');

describe('branchProblems', () => {
  it('accepts every allowed prefix with an issue number into develop', () => {
    for (const head of [
      'feature/44-place-search',
      'fix/87-login-error',
      'chore/156-commit-conventions',
      'docs/23-readme-team',
    ]) {
      assert.deepEqual(branchProblems(head, 'develop'), []);
    }
  });

  it('accepts develop into main', () => {
    assert.deepEqual(branchProblems('develop', 'main'), []);
  });

  it('rejects any other branch into main', () => {
    assert.equal(branchProblems('feature/44-place-search', 'main').length, 1);
  });

  it('rejects a branch without an issue number', () => {
    assert.equal(branchProblems('feature/place-search', 'develop').length, 1);
  });

  it('rejects an issue number without a description', () => {
    for (const head of ['feature/44', 'feature/44-']) {
      assert.equal(branchProblems(head, 'develop').length, 1, head);
    }
  });

  it('rejects an unknown prefix', () => {
    assert.equal(branchProblems('feat/44-place-search', 'develop').length, 1);
  });

  it('rejects uppercase letters, underscores and spaces', () => {
    for (const head of [
      'feature/44-Search',
      'feature/44-place_search',
      'feature/44-place search',
    ]) {
      assert.equal(branchProblems(head, 'develop').length, 1, head);
    }
  });

  it('rejects a target other than develop or main', () => {
    assert.equal(branchProblems('feature/44-place-search', 'release').length, 1);
  });
});

describe('titleProblems', () => {
  it('accepts titles with and without scope', () => {
    for (const title of ['feat(places): add search with filters', 'chore: update dependencies']) {
      assert.deepEqual(titleProblems(title), []);
    }
  });

  it('accepts every type', () => {
    for (const type of [
      'feat',
      'fix',
      'perf',
      'refactor',
      'test',
      'docs',
      'style',
      'build',
      'ci',
      'chore',
      'revert',
    ]) {
      assert.deepEqual(titleProblems(`${type}: change something`), [], type);
    }
  });

  it('accepts a breaking change marker', () => {
    assert.deepEqual(titleProblems('refactor(api)!: rename review routes'), []);
  });

  it('accepts the release title', () => {
    assert.deepEqual(titleProblems('chore(release): v0.2.0', 'develop'), []);
  });

  it('accepts acronyms at the start of the description', () => {
    assert.deepEqual(titleProblems('docs(readme): README sections for the evaluation'), []);
  });

  it('rejects a title without type', () => {
    assert.equal(titleProblems('Add sign-up endpoint').length, 1);
  });

  it('rejects an unknown type', () => {
    assert.equal(titleProblems('feature: add sign-up endpoint').length, 1);
  });

  it('rejects a scope that is not in the list', () => {
    assert.equal(titleProblems('feat(authentication): add sign-up endpoint').length, 1);
  });

  it('rejects a description that starts with a capital letter', () => {
    assert.equal(titleProblems('feat(auth): Add sign-up endpoint').length, 1);
  });

  it('rejects a type that does not belong to the branch prefix', () => {
    assert.equal(titleProblems('feat(places): add search', 'docs/44-search-guide').length, 1);
    assert.deepEqual(titleProblems('refactor(api): split routes', 'chore/50-split-routes'), []);
  });

  it('rejects a missing space after the colon', () => {
    assert.equal(titleProblems('feat:add sign-up endpoint').length, 1);
  });

  it('rejects titles that are too long', () => {
    assert.equal(titleProblems(`feat: ${'a'.repeat(80)}`).length, 1);
  });

  it('rejects a trailing period', () => {
    assert.equal(titleProblems('fix: handle empty lists.').length, 1);
  });
});
