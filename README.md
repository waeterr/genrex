# genrex

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white" alt="Biome" />
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.2.0-blue?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
</p>

> **Forge production-ready projects from configurable blueprints.**

`genrex` is a modern, lightweight project scaffolding CLI engine. Rather than copying generic boilerplates, it generates strongly-typed, coherent software projects with Biome, Vitest, CI/CD, and Docker support tailored to your stack.

---

## Tech Stack & Ecosystem

- **Language & Runtime:** TypeScript (Strict, Native ESM), Node.js (>=20)
- **Code Quality & Testing:** Biome (Format/Lint), Vitest
- **API Framework:** Fastify + `tsx` hot-reload
- **DevOps & Containers:** Multi-stage Docker, GitHub Actions CI
- **Package Managers:** `pnpm`, `npm`, `yarn`, `bun`

---

## Quick Start

Run directly with `npx`:

```bash
npx genrex create my-api --blueprint node-api
```

Preview what will be generated without writing to disk:

```bash
npx genrex create my-cli --dry-run
```

---

## Blueprints

| Blueprint | ID | Description |
|---|---|---|
| **TypeScript CLI** | `ts-cli` | Standalone CLI binary, ESM, Biome formatting, Vitest |
| **Node.js API** | `node-api` | Fastify REST API, hot-reload (`tsx`), healthchecks |
| **TypeScript Library** | `ts-lib` | Publishable library with dual ESM exports and `.d.ts` declaration maps |

View all blueprints anytime:

```bash
genrex list
genrex info ts-cli
```

---

## Commands & Usage

### 1. Create a Project

```bash
genrex create <project-name> [options]
```

**Options:**

| Flag | Description | Default |
|---|---|---|
| `--blueprint <id>` | Blueprint template (`ts-cli`, `node-api`, `ts-lib`) | `ts-cli` |
| `--package-manager <pm>` | `npm`, `pnpm`, `yarn`, or `bun` | `pnpm` |
| `--git` | Initialize empty Git repository | `false` |
| `--github-actions` | Generate GitHub Actions CI test/lint workflow | `false` |
| `--docker` | Generate optimized multi-stage Dockerfile | `false` |
| `--dry-run` | Preview file tree and dependencies without writing files | `false` |
| `--skip-install` | Scaffold files without running package installation | `false` |

**Full-fledged Example:**

```bash
genrex create billing-service \
  --blueprint node-api \
  --package-manager pnpm \
  --git \
  --github-actions \
  --docker
```

---

### 2. Environment Doctor

Diagnose your environment tools in one command:

```bash
genrex doctor
```

```text
genrex Doctor

Environment
────────────────────────────────────────
✓ Node.js        v22.20.0
✓ npm            10.9.3
✓ Git            git version 2.49.0
○ pnpm           not found (optional)
○ yarn           not found (optional)
○ bun            not found (optional)

Environment is ready.
```

---

## Design Principles

- **Zero Unnecessary Bloat:** Fast execution with near-zero runtime dependencies.
- **Fail Safely:** Refuses to overwrite non-empty directories; pre-validates all input and tools before modifying the disk.
- **Modern Standards:** Native ESM, strict TypeScript, Biome linter/formatter, and Vitest by default.
- **Cross-Platform:** Works seamlessly on Windows, macOS, and Linux.

---

## Development

```bash
git clone https://github.com/waeterr/genrex.git
cd genrex
npm install
npm test
npm run build
```

---

## License

MIT © [waeterr](https://github.com/waeterr)
