// Fails the pull request if any commit is not authored by a real GitHub user
// or carries AI attribution. See docs/decisions/0004-commit-authorship.md.

const AI_PATTERN =
  /claude|anthropic|copilot|openai|chatgpt|codex|cursor|gemini|google-labs|antigravity|devin|\[bot\]/i;
const CO_AUTHOR_LINE = /^co-authored-by:.*$/gim;
const GENERATED_LINE = /^.*generated (with|by) .*$/gim;

function aiAttribution(text) {
  const lines = [...(text.match(CO_AUTHOR_LINE) ?? []), ...(text.match(GENERATED_LINE) ?? [])];
  return lines.filter((line) => AI_PATTERN.test(line));
}

function isBot(user) {
  return user?.type === 'Bot' || /\[bot\]$/i.test(user?.login ?? '');
}

async function checkCommitAuthors({ github, context, core }) {
  const pr = context.payload.pull_request;
  const problems = [];

  const commits = await github.paginate(github.rest.pulls.listCommits, {
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pr.number,
    per_page: 100,
  });

  for (const c of commits) {
    const sha = c.sha.slice(0, 7);
    const email = c.commit.author?.email ?? 'unknown';
    if (!c.author) {
      problems.push(
        `${sha}: author email "${email}" is not linked to any GitHub account. ` +
          'Set `git config user.email` to an email verified on your GitHub account.',
      );
    } else if (isBot(c.author)) {
      problems.push(`${sha}: authored by bot account "${c.author.login}".`);
    }
    if (isBot(c.committer)) {
      problems.push(`${sha}: committed by bot account "${c.committer.login}".`);
    }
    for (const line of aiAttribution(c.commit.message)) {
      problems.push(`${sha}: AI attribution in the commit message: "${line.trim()}"`);
    }
  }

  for (const line of aiAttribution(`${pr.title}\n${pr.body ?? ''}`)) {
    problems.push(`Pull request title or description has AI attribution: "${line.trim()}"`);
  }

  if (problems.length > 0) {
    core.setFailed(
      `Commits must be authored by team members' own GitHub accounts:\n- ${problems.join('\n- ')}`,
    );
  } else {
    core.info(`All ${commits.length} commit(s) are authored by team members.`);
  }
}

module.exports = { checkCommitAuthors, aiAttribution, isBot };
