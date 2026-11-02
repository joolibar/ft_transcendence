const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { branchProblems, titleProblems } = require('./check-pr-conventions.cjs');

describe('branchProblems', () => {
  it('accepts every allowed prefix into develop', () => {
    for (const head of [
      'feature/auth-signup',
      'fix/login-error',
      'chore/ci-cache',
      'docs/db-guide',
    ]) {
      assert.deepEqual(branchProblems(head, 'develop'), []);
    }
  });

  it('accepts develop into main', () => {
    assert.deepEqual(branchProblems('develop', 'main'), []);
  });

  it('rejects any other branch into main', () => {
    assert.equal(branchProblems('feature/auth-signup', 'main').length, 1);
  });

  it('rejects an unknown prefix', () => {
    assert.equal(branchProblems('feat/auth-signup', 'develop').length, 1);
  });

  it('rejects uppercase letters, underscores and spaces', () => {
    for (const head of ['feature/Auth', 'feature/auth_signup', 'feature/auth signup']) {
      assert.equal(branchProblems(head, 'develop').length, 1, head);
    }
  });

  it('rejects a branch without a description', () => {
    assert.equal(branchProblems('feature/', 'develop').length, 1);
  });

  it('rejects a target other than develop or main', () => {
    assert.equal(branchProblems('feature/auth-signup', 'release').length, 1);
  });
});

describe('titleProblems', () => {
  it('accepts titles with and without scope', () => {
    for (const title of ['feat(auth): add sign-up endpoint', 'chore: update dependencies']) {
      assert.deepEqual(titleProblems(title), []);
    }
  });

  it('accepts a breaking change marker', () => {
    assert.deepEqual(titleProblems('refactor(api)!: rename review routes'), []);
  });

  it('rejects a title without type', () => {
    assert.equal(titleProblems('Add sign-up endpoint').length, 1);
  });

  it('rejects an unknown type', () => {
    assert.equal(titleProblems('feature: add sign-up endpoint').length, 1);
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
