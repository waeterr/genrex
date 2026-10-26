#!/usr/bin/env node

import { blueprints, getBlueprint } from "./blueprints.js";

const [command, ...args] = process.argv.slice(2);

switch (command) {
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
  list           List available blueprints
  info <name>    Show blueprint details
  create [name]  Create a project
  doctor         Check local environment

Options:
  -h, --help     Show help
  -v, --version  Show version`);
}
