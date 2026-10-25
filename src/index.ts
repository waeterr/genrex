#!/usr/bin/env node

const [command] = process.argv.slice(2);

switch (command) {
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

function printHelp(): void {
  console.log(`genrex — Project Blueprint Engine

Usage:
  genrex <command>

Commands:
  create [name]  Create a project
  list           List available blueprints
  info <name>    Show blueprint details
  doctor         Check local environment

Options:
  -h, --help     Show help
  -v, --version  Show version`);
}
