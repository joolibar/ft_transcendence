# Testing guide

Every change that adds or modifies behaviour comes with tests. CI runs all of them on every pull request, and a PR cannot be merged while a test fails.

## Tools

| Tool                                                                             | Used for                                                 |
| -------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [Vitest](https://vitest.dev/)                                                    | Test runner for every workspace                          |
| Fastify `app.inject()`                                                           | Calling API routes without opening a real network port   |
| [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) | Rendering React components and querying them like a user |
| jsdom                                                                            | A simulated browser for web tests                        |

## Running tests

The API tests need PostgreSQL. Start it once (it stays running in the background):

```bash
make db
```

Then, from the repository root:

| Command              | What it does                                                               |
| -------------------- | -------------------------------------------------------------------------- |
| `pnpm test`          | Run every test once                                                        |
| `pnpm test:watch`    | Re-run affected tests on every file save                                   |
| `pnpm test:coverage` | Run every test and print a coverage report (also in `coverage/index.html`) |

To run a single workspace: `pnpm --filter @miga/api test` (or `@miga/web`, `@miga/shared`).

## Where tests go

A test lives **next to the file it tests**, with the same name plus `.test`:

```
apps/api/src/modules/reviews/
├── reviews.routes.ts
├── reviews.routes.test.ts
├── reviews.service.ts
└── reviews.service.test.ts
```

Each workspace has its own `vitest.config.ts` (environment, setup). The root `vitest.config.ts` runs them together.

## What to test

| Workspace         | Test                                                                                 | Example                                |
| ----------------- | ------------------------------------------------------------------------------------ | -------------------------------------- |
| `packages/shared` | Every schema: valid input passes, each kind of invalid input fails                   | `health.test.ts`                       |
| `apps/api`        | Every route: success, validation errors, auth errors, not found. Services with logic | `health.routes.test.ts`, `env.test.ts` |
| `apps/web`        | What the user sees and does: rendering, interactions, loading and error states       | `App.test.tsx`                         |

For each feature, cover at least:

1. **The happy path:** the normal case works.
2. **Invalid input:** every validation rule rejects bad data.
3. **Failure cases:** the database is down, the API answers an error, the user is not allowed.
4. **Edge cases:** empty lists, limits, duplicates.

## How to write a good test

- **Name it as a sentence** describing the behaviour: `it('rejects a review without a rating')`.
- **One behaviour per test.** If the name needs "and", split it.
- **Arrange, act, assert:** prepare the data, run the code, check the result, separated by blank lines.
- **Test behaviour, not implementation.** In the web app, query elements by role and visible text (`getByRole`, `findByText`), as a user would find them, not by CSS classes.
- **Tests are independent.** Each one creates the data it needs and cleans up after itself; they must pass in any order.
- **Mock only what you do not control.** Mock `fetch` in web tests; use the real database in API tests.

## Coverage

`pnpm test:coverage` reports which lines no test executes. Startup code (`server.ts`, `main.tsx`) and generated code are excluded.

The `Tests` check fails if statements, branches, functions or lines drop below **80 %** (`thresholds` in [`vitest.config.ts`](../../vitest.config.ts)). A PR that adds code without tests will usually fail it. The answer is to write the missing tests, never to lower the numbers; raise them as the project grows. Use the report to find untested logic, not to chase a number: a test that runs a line without checking its result adds coverage but no safety.
