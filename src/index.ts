#!/usr/bin/env node

import { createProject, type CreateOptions } from "./create.js";
import { blueprints, getBlueprint } from "./blueprints.js";

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case "create":
    runCreate(args);
    break;
  case "list":
    listBlueprints();
    break;
  case "info":
    showBlueprintInfo(args[0]);
    break;
  case "--help":
  case "-h":
  case undefined:
    printHelp();
    break;
  case "--version":
  case "-v":
    console.log("0.1.0");
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error("Run 'genrex --help' for usage.");
    process.exitCode = 1;
}

function runCreate(args: string[]): void {
  const [name, ...flags] = args;
  const options: CreateOptions = { dryRun: false, skipInstall: false, git: false };

  for (let index = 0; index < flags.length; index += 1) {
    const flag = flags[index];
    if (flag === "--dry-run") {
      options.dryRun = true;
    } else if (flag === "--skip-install") {
      options.skipInstall = true;
    } else if (flag === "--git") {
      options.git = true;
    } else if (flag === "--blueprint") {
      options.blueprint = flags[++index];
    } else if (flag === "--package-manager") {
      const packageManager = flags[++index];
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

  createProject(name, options);
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
  list                              List available blueprints
  info <name>                       Show blueprint details
  create <name> --dry-run           Preview project generation
  doctor                            Check local environment

Create options:
  --blueprint <id>                  Blueprint ID (default: ts-cli)
  --package-manager <manager>       npm, pnpm, yarn, or bun (default: pnpm)
  --dry-run                         Preview without filesystem changes
  --skip-install                    Do not install dependencies
  --git                             Initialize a Git repository

Options:
  -h, --help                        Show help
  -v, --version                     Show version`);
}
