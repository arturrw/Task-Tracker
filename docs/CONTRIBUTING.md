# Contributing

Thanks for considering a contribution — this is a small personal project, so the process is intentionally lightweight.

## Getting set up

1. Fork the repo and clone your fork
2. Follow the [installation steps in the README](../README.md#installation) to get a local database and `.env` working
3. Create a branch off `main`:

   ```bash
   git checkout -b feature/short-description
   ```

## Branch & commit style

- Branch names: `feature/...`, `fix/...`, `docs/...`, `chore/...`
- Commit messages: short, imperative mood ("Add task filter by category", not "Added" or "Adding")
- Keep commits focused — one logical change per commit is easier to review than one giant diff

## Code style

The project doesn't use a linter yet, so please just match what's already there:

- CommonJS (`require`/`module.exports`), not ESM
- `async/await` for anything touching the database or an external API, wrapped in `try/catch`
- Routes stay thin: parse input, call a model/service, render or redirect. Put logic in `models/` or `services/`, not in `routes/`
- All SQL goes through `models/*.js` using parameterized queries (`?` placeholders) — never build SQL with string concatenation
- EJS output should use `<%= %>` (escaped) unless you have a specific, reviewed reason to use `<%- %>`

## Database changes

If your change needs a new column or table, update `sql/schema.sql` and mention the change in your PR description so reviewers know to re-run it locally.

## Testing your change

There is no automated test suite yet (see [ARCHITECTURE.md](ARCHITECTURE.md#known-limitations) — contributions adding one, e.g. with `jest` + `supertest`, are very welcome). Until then, please test manually:

1. Register a new account
2. Create, edit, filter, complete and delete a task
3. Update your profile city and confirm the dashboard weather widget still degrades gracefully without an API key

## Submitting a PR

- Describe **what** changed and **why**, not just what files were touched
- Link any related issue
- Screenshots are appreciated for anything touching a view (`views/*.ejs`)
- Keep the scope tight — unrelated formatting changes make diffs harder to review

## Reporting bugs / suggesting features

Open an issue with:

- What you expected vs. what happened
- Steps to reproduce (for bugs)
- Node.js and MySQL versions if it looks environment-related
