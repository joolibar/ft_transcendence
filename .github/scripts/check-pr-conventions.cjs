// Checks that a pull request follows docs/decisions/0003-branching-and-commits.md:
// the branch name, the target branch and the title (which becomes the commit
// message when the PR is squash-merged).

const BRANCH_PATTERN = /^(feature|fix|chore|docs)\/[a-z0-9]+(-[a-z0-9]+)*$/;
const TITLE_PATTERN = /^(feat|fix|chore|docs|refactor|test|style)(\([a-z0-9-]+\))?!?: \S.*$/;
const TITLE_MAX_LENGTH = 72;

function branchProblems(head, base) {
  if (base === 'main') {
    return head === 'develop'
      ? []
      : [`Pull requests into main must come from develop, not from "${head}".`];
  }
  const problems = [];
  if (base !== 'develop') {
    problems.push(`Pull requests must target develop, not "${base}".`);
  }
  if (!BRANCH_PATTERN.test(head)) {
    problems.push(
      `Branch "${head}" must look like feature/short-name, fix/short-name, ` +
        'chore/short-name or docs/short-name (lowercase words separated by hyphens).',
    );
  }
  return problems;
}

function titleProblems(title) {
  const problems = [];
  if (!TITLE_PATTERN.test(title)) {
    problems.push(
      `Title "${title}" must follow Conventional Commits: "type(scope): description", ` +
        'with type feat, fix, chore, docs, refactor, test or style.',
    );
  }
  if (title.length > TITLE_MAX_LENGTH) {
    problems.push(`Title is ${title.length} characters long; keep it under ${TITLE_MAX_LENGTH}.`);
  }
  if (title.endsWith('.')) {
    problems.push('Title must not end with a period.');
  }
  return problems;
}

function report(core, problems, success) {
  if (problems.length > 0) core.setFailed(problems.join('\n'));
  else core.info(success);
}

function checkBranch({ context, core }) {
  const { head, base } = context.payload.pull_request;
  report(
    core,
    branchProblems(head.ref, base.ref),
    `Branch "${head.ref}" → "${base.ref}" is valid.`,
  );
}

function checkTitle({ context, core }) {
  const { title } = context.payload.pull_request;
  report(core, titleProblems(title), `Title "${title}" is valid.`);
}

module.exports = { checkBranch, checkTitle, branchProblems, titleProblems };
