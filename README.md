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
  <a href="https://www.npmjs.com/package/genrex"><img src="https://img.shields.io/npm/v/genrex?style=flat-square&color=cb3837" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/node-%3E%3D20-brightgreen?style=flat-square" alt="Node version" />
</p>

> **Forge production-ready projects from configurable blueprints.**

`genrex` is a modern, lightweight CLI scaffolding engine. Rather than copying bare-bones or obsolete boilerplates, it generates strictly-typed, coherent software projects equipped with modern standards: **Biome**, **Vitest**, native ESM, **GitHub Actions CI**, and multi-stage **Dockerfiles**.

---

## ⚡ Installation & Execution

You have two ways to run `genrex`:

### 1. One-Time Run (Recommended — No Install Needed)

Run the latest version instantly using `npx`:

```bash
npx genrex create
```

Or target a specific name directly:

```bash
npx genrex create my-app
```

---

### 2. Global Installation

If you frequently scaffold new projects, install `genrex` globally:

```bash
# Using npm
npm install -g genrex

# Using pnpm
pnpm add -g genrex

# Using yarn
yarn global add genrex

# Using bun
bun add -g genrex
```

Once installed, use the `genrex` command anywhere:

```bash
genrex create
```

---

## 🎯 Interactive Wizard Mode

Running `genrex create` without options launches an interactive step-by-step setup wizard:

```text
genrex — Project Blueprint Engine

? Project name: my-fastify-api

? Choose a blueprint:
  1) TypeScript CLI         (ts-cli)
  2) Node.js API            (node-api)
  3) TypeScript Library     (ts-lib)
Select [1-3] (1): 2

? Package manager:
  1) pnpm
  2) npm
  3) yarn
  4) bun
Select [1-4] (1): 1

? Initialize Git? (Y/n): y
? Add GitHub Actions CI? (y/N): y
? Add Docker? (y/N): y

✓ Project scaffolded in /path/to/my-fastify-api
Installing dependencies using pnpm...
✓ Dependencies installed
Initializing Git repository...
✓ Git repository initialized

Done. Next steps:
  cd my-fastify-api
  pnpm run dev
  pnpm test
```

---

## 📖 Complete Command Reference

| Command | Description |
|---|---|
| `genrex create [name]` | Scaffold a new project (interactive wizard by default) |
| `genrex list` | Show all available blueprints and descriptions |
| `genrex info <id>` | Inspect detailed metadata & capabilities of a blueprint |
| `genrex doctor` | Audit local development environment tools and versions |
| `genrex -v, --version` | Output current CLI version |
| `genrex -h, --help` | Display command usage and option flags |

---

### 1. `genrex create [name] [options]`

Scaffold a project. You can skip interactive prompts entirely using flags (ideal for CI/automation scripts).

#### Command Flags:

| Flag | Description | Default |
|---|---|---|
| `-i, --interactive` | Force interactive wizard even if name is supplied | `false` |
| `--blueprint <id>` | Target blueprint: `ts-cli`, `node-api`, or `ts-lib` | `ts-cli` |
| `--package-manager <pm>` | `npm`, `pnpm`, `yarn`, or `bun` | `pnpm` |
| `--git` | Initialize empty Git repository | `false` |
| `--github-actions` | Generate `.github/workflows/ci.yml` CI workflow | `false` |
| `--docker` | Generate multi-stage `Dockerfile` and `.dockerignore` | `false` |
| `--dry-run` | Preview files and packages without writing to disk | `false` |
| `--skip-install` | Scaffold files without executing package manager install | `false` |

#### Non-Interactive Examples:

```bash
# Preview what would be created without writing any files
genrex create my-tool --blueprint ts-cli --dry-run

# Node.js API with pnpm, Git, and GitHub Actions
genrex create backend-service --blueprint node-api --package-manager pnpm --git --github-actions

# Lightweight library without waiting for dependency installation
genrex create math-utils --blueprint ts-lib --skip-install

# Full-stack microservice with Docker containerization
genrex create auth-service --blueprint node-api --docker --github-actions --git
```

---

### 2. `genrex list`

List all built-in blueprint architectures:

```bash
genrex list
```

```text
Available blueprints:

  ts-cli       TypeScript CLI (TypeScript)
               Production-ready TypeScript CLI tool.

  node-api     Node.js API (TypeScript)
               Node.js REST API with routing and healthchecks.

  ts-lib       TypeScript Library (TypeScript)
               Publishable TypeScript library blueprint.
```

---

### 3. `genrex info <blueprint-id>`

Inspect capabilities and metadata of any blueprint:

```bash
genrex info node-api
```

```text
Node.js API (node-api)
Version:      1.0.0
Language:     TypeScript
Description:  Node.js REST API with routing and healthchecks.
Capabilities:
  - testing
  - formatting
  - git
  - github-actions
  - docker
```

---

### 4. `genrex doctor`

Audit your machine's environment and ensure required developer tools are installed:

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

## 🏗️ Available Blueprints & Project Structures

### 1. TypeScript CLI (`ts-cli`)
Tailored for building standalone developer tools and CLI applications.
```text
my-cli/
├── src/
│   └── index.ts          # Executable binary entry point with shebang
├── tests/
│   └── index.test.ts     # Vitest unit test suite
├── .gitignore
├── biome.json            # High-performance linter & formatter
├── package.json          # Configured with "bin" field and ESM
├── tsconfig.json         # Strict NodeNext configuration
└── README.md
```

### 2. Node.js API (`node-api`)
Production-ready REST API built with Fastify.
```text
my-api/
├── src/
│   └── server.ts         # Fastify server with /health route
├── tests/
│   └── server.test.ts    # Vitest route testing
├── .gitignore
├── biome.json
├── package.json          # Development with "tsx watch" hot-reload
├── tsconfig.json
└── README.md
```

### 3. TypeScript Library (`ts-lib`)
Ready for distribution on npm with dual type declarations.
```text
my-lib/
├── src/
│   └── index.ts          # Library exports
├── tests/
│   └── index.test.ts     # Vitest test suite
├── .gitignore
├── .npmignore            # Keeps source and tests out of npm tarball
├── biome.json
├── package.json          # "exports", "main", "types", "prepublishOnly"
├── tsconfig.json         # Generates declaration maps (.d.ts)
└── README.md
```

---

## 🛡️ Safety & Core Philosophy

- **Zero Accidental Overwriting:** Refuses to generate files inside non-empty folders.
- **Shell Injection Safe:** Child processes use direct executable arguments (`shell: false`) rather than concatenated shell strings.
- **Fail Fast:** Project names, blueprint availability, and Git binary presence are validated before modifying the filesystem.
- **Zero Heavy Runtime Dependencies:** Blazing fast execution using native Node.js APIs (`node:readline/promises`, `node:child_process`, `node:fs`).

---

## 💻 Development & Contributing

Want to add new blueprints or improve the CLI?

```bash
# Clone the repository
git clone https://github.com/waeterr/genrex.git
cd genrex

# Install dev dependencies
npm install

# Run automated tests (native Node test runner + TypeScript strip)
npm test

# Build TypeScript to dist/
npm run build
```

---

## 📄 License

MIT © [waeterr](https://github.com/waeterr)
