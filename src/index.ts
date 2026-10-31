#!/usr/bin/env node

import { createProject, type CreateOptions } from "./create.js";
import { runDoctor } from "./doctor.js";
import { blueprints, getBlueprint } from "./blueprints.js";

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case "create":
    await runCreate(args);
    break;
  case "list":
    listBlueprints();
    break;
  case "info":
    showBlueprintInfo(args[0]);
    break;
  case "doctor":
    runDoctor();
    break;
  case "--help":
  case "-h":
  case undefined:
    printHelp();
    break;
  case "--version":
  case "-v":
    console.log("0.2.1");
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error("Run 'genrex --help' for usage.");
    process.exitCode = 1;
}

async function runCreate(args: string[]): Promise<void> {
  const [firstArg, ...flags] = args;
  let name = firstArg?.startsWith("-") ? undefined : firstArg;
  const allFlags = firstArg?.startsWith("-") ? [firstArg, ...flags] : flags;

  const options: CreateOptions = {
    dryRun: false,
    skipInstall: false,
    git: false,
    githubActions: false,
    docker: false,
    interactive: false,
  };

  for (let index = 0; index < allFlags.length; index += 1) {
    const flag = allFlags[index];
    if (flag === "--dry-run") {
      options.dryRun = true;
    } else if (flag === "--skip-install") {
      options.skipInstall = true;
    } else if (flag === "--git") {
      options.git = true;
    } else if (flag === "--github-actions") {
      options.githubActions = true;
    } else if (flag === "--docker") {
      options.docker = true;
    } else if (flag === "-i" || flag === "--interactive") {
      options.interactive = true;
    } else if (flag === "--blueprint") {
      options.blueprint = allFlags[++index];
    } else if (flag === "--package-manager") {
      const packageManager = allFlags[++index];
      if (!["npm", "pnpm", "yarn", "bun"].includes(packageManager)) {
        console.error(`Error: Unsupported package manager '${packageManager}'.`);
        process.exitCode = 1;
        return;
      }
      options.packageManager = packageManager as CreateOptions["packageManager"];
    } else {
      console.error(`Error: Unknown create option '${flag}'.`);
      process.exitCode = 1;
      return;
    }
  }

  await createProject(name, options);
}

function listBlueprints(): void {
  console.log("Available blueprints:\n");
  for (const b of blueprints) {
    console.log(`  ${b.id.padEnd(12)} ${b.name} (${b.language})`);
    console.log(`               ${b.description}\n`);
  }
}

function showBlueprintInfo(id?: string): void {
  if (!id) {
    console.error("Error: Blueprint ID required. Example: genrex info ts-cli");
    process.exitCode = 1;
    return;
  }

  const bp = getBlueprint(id);
  if (!bp) {
    console.error(`Error: Blueprint '${id}' not found.`);
    process.exitCode = 1;
    return;
  }

  console.log(`${bp.name} (${bp.id})`);
  console.log(`Version:      ${bp.version}`);
  console.log(`Language:     ${bp.language}`);
  console.log(`Description:  ${bp.description}`);
  console.log("Capabilities:");
  for (const c of bp.capabilities) {
    console.log(`  - ${c}`);
  }
}

function printHelp(): void {
  console.log(`genrex — Project Blueprint Engine

Usage:
  genrex <command> [options]

Commands:
  create [name]                     Create a project (interactive wizard by default)
  list                              List available blueprints
  info <name>                       Show blueprint details
  doctor                            Check local environment

Create options:
  -i, --interactive                 Launch interactive prompt wizard
  --blueprint <id>                  Blueprint ID (ts-cli, node-api, ts-lib)
  --package-manager <manager>       npm, pnpm, yarn, or bun (default: pnpm)
  --git                             Initialize a Git repository
  --github-actions                  Generate GitHub Actions CI workflow
  --docker                          Generate Dockerfile & .dockerignore
  --dry-run                         Preview without filesystem changes
  --skip-install                    Do not install dependencies

Options:
  -h, --help                        Show help
  -v, --version                     Show version`);
}
