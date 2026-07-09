# CLAUDE.md

Project instructions for AI assistants working in this repository.

## Project Overview

**FE-01** is a frontend project. This repository is in early setup — update this file as the stack, structure, and workflows are established.

## Tech Stack

<!-- Update as the project is scaffolded -->
- **Language:** TBD
- **Framework:** TBD
- **Package manager:** TBD
- **Styling:** TBD
- **Testing:** TBD

## Commands

<!-- Replace with actual commands once tooling is configured -->

```bash
# Install dependencies
# npm install | pnpm install | yarn install

# Start dev server
# npm run dev

# Run tests
# npm test

# Lint
# npm run lint

# Build for production
# npm run build
```

## Project Structure

```
FE-01/
├── CLAUDE.md       # AI assistant instructions (this file)
└── README.md       # Project readme
```

Add a directory map here once the codebase is scaffolded (e.g. `src/`, `components/`, `pages/`).

## Conventions

- Keep changes focused and minimal — solve the task at hand without unrelated refactors.
- Match existing naming, file layout, and patterns in the codebase.
- Prefer editing existing files over creating new ones unless a new module is clearly needed.
- Do not commit secrets (`.env`, API keys, credentials).
- Only create git commits when explicitly asked.

## Code Style

- Use functional components and hooks for React (if applicable).
- Colocate related logic (components, hooks, types) when it aids readability.
- Avoid over-engineering — no premature abstractions or excessive error handling for unlikely edge cases.
- Add comments only for non-obvious business logic or tricky technical details.

## Testing

- Run the test suite before considering a change complete.
- Add tests for new behavior when the project has a test setup; do not add trivial tests that only assert the obvious.

## Rules

- Do not edit generated files unless the generation source is updated.
- Do not force-push to `main`/`master`.
- Do not skip git hooks unless explicitly requested.
- Ask before making large architectural changes or adding new dependencies.

## Gotchas

<!-- Add project-specific pitfalls as they are discovered -->

- This file should be updated when the stack, commands, or conventions change.
