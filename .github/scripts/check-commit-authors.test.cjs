const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { aiAttribution, checkCommitAuthors, isBot } = require('./check-commit-authors.cjs');

function commit(sha, author, message, committer = { login: 'web-flow', type: 'User' }) {
  return {
    sha: sha.padEnd(40, '0'),
    author,
    committer,
    commit: { author: { email: 'someone@example.com' }, message },
  };
}

async function run(commits, prBody = '') {
  const result = { failed: null, info: null };
  await checkCommitAuthors({
    github: { paginate: async () => commits, rest: { pulls: { listCommits: null } } },
    context: {
      repo: { owner: 'joolibar', repo: 'ft_transcendence' },
      payload: { pull_request: { number: 1, title: 'feat: x', body: prBody } },
    },
    core: {
      setFailed: (message) => (result.failed = message),
      info: (message) => (result.info = message),
    },
  });
  return result;
}

const member = { login: 'joolibar', type: 'User' };

describe('aiAttribution', () => {
  it('finds AI co-author trailers in any letter case', () => {
    const lines = aiAttribution('feat: x\n\nCo-Authored-By: Claude <noreply@anthropic.com>');
    assert.equal(lines.length, 1);
  });

  it('finds "Generated with" lines', () => {
    assert.equal(aiAttribution('Generated with [Claude Code](https://claude.com)').length, 1);
  });

  it('allows co-authors who are people', () => {
    assert.deepEqual(aiAttribution('feat: x\n\nCo-authored-by: Ana <ana@example.com>'), []);
  });
});

describe('isBot', () => {
  it('detects bot accounts by type and by login', () => {
    assert.equal(isBot({ login: 'renovate', type: 'Bot' }), true);
    assert.equal(isBot({ login: 'copilot-swe-agent[bot]', type: 'User' }), true);
    assert.equal(isBot(member), false);
  });
});

describe('checkCommitAuthors', () => {
  it('passes commits by team members', async () => {
    const result = await run([commit('a1', member, 'feat: add reviews')]);
    assert.equal(result.failed, null);
  });

  it('fails a commit whose email is not linked to GitHub', async () => {
    const result = await run([commit('b1', null, 'feat: add reviews')]);
    assert.match(result.failed, /not linked to any GitHub account/);
  });

  it('fails a commit authored by a bot', async () => {
    const bot = { login: 'copilot-swe-agent[bot]', type: 'Bot' };
    const result = await run([commit('c1', bot, 'fix: typo')]);
    assert.match(result.failed, /authored by bot account/);
  });

  it('fails a commit committed by a bot', async () => {
    const result = await run([commit('d1', member, 'fix: typo', { login: 'x', type: 'Bot' })]);
    assert.match(result.failed, /committed by bot account/);
  });

  it('fails a commit with an AI co-author', async () => {
    const message = 'feat: x\n\nCo-Authored-By: Claude <noreply@anthropic.com>';
    const result = await run([commit('e1', member, message)]);
    assert.match(result.failed, /AI attribution in the commit message/);
  });

  it('fails a pull request description with AI attribution', async () => {
    const body = 'Generated with [Claude Code](https://claude.com/claude-code)';
    const result = await run([commit('f1', member, 'feat: x')], body);
    assert.match(result.failed, /Pull request title or description/);
  });
});
