// Checks that a pull request follows docs/decisions/0003-branching-and-commits.md and
// 0010-commit-conventions.md: the branch name, the target branch and the title (which
// becomes the commit message when the PR is squash-merged). The allowed types, branch
// prefixes and scopes live in .github/conventions.json, shared with commitlint.

const conventions = require('../conventions.json');

const TYPES = Object.keys(conventions.types);
const PREFIXES = Object.keys(conventions.branches);
const SCOPES = Object.keys(conventions.scopes);
const BRANCH_PATTERN = new RegExp(`^(${PREFIXES.join('|')})/(\\d+)-[a-z0-9]+(-[a-z0-9]+)*$`);
const TITLE_PATTERN = /^([a-z]+)(?:\(([a-z0-9-]+)\))?(!)?: (\S.*)$/;
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
      `Branch "${head}" must look like <prefix>/<issue>-<description>, for example ` +
        `feature/44-place-search, with prefix ${PREFIXES.join(', ')} and lowercase words ` +
        'separated by hyphens.',
    );
  }
  return problems;
}

// `head` is optional: when it is a work branch, the type must belong to its prefix.
function titleProblems(title, head) {
  const problems = [];
  const match = TITLE_PATTERN.exec(title);
  if (!match) {
    problems.push(
      `Title "${title}" must follow Conventional Commits: "type(scope): description", ` +
        'for example "feat(places): add search with filters".',
    );
  } else {
    const [, type, scope, , description] = match;
    if (!TYPES.includes(type)) {
      problems.push(`Type "${type}" is not allowed. Use one of: ${TYPES.join(', ')}.`);
    }
    if (scope !== undefined && !SCOPES.includes(scope)) {
      problems.push(
        `Scope "${scope}" is not in .github/conventions.json. Use one of: ${SCOPES.join(', ')}, ` +
          'or add it there in its own PR.',
      );
    }
    if (/^[A-Z][a-z]/.test(description)) {
      problems.push(
        'The description must start with a lowercase letter: "add search", not "Add search".',
      );
    }
    const prefix = head && head.split('/')[0];
    if (
      TYPES.includes(type) &&
      conventions.branches[prefix] &&
      !conventions.branches[prefix].includes(type)
    ) {
      problems.push(
        `Type "${type}" does not belong in a ${prefix}/ branch, which takes ` +
          `${conventions.branches[prefix].join(', ')}.`,
      );
    }
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
  const { title, head } = context.payload.pull_request;
  report(core, titleProblems(title, head.ref), `Title "${title}" is valid.`);
}

module.exports = { checkBranch, checkTitle, branchProblems, titleProblems };
