import { basename, resolve } from "node:path";
import { getBlueprint } from "./blueprints.js";
import {
  type PackageManager,
  type ProjectConfig,
  validateConfig,
} from "./config.js";
import {
  buildTsCliFiles,
  prepareDestination,
  writeProjectFiles,
} from "./generator.js";
import { checkGit, initGit } from "./git.js";
import { installDependencies } from "./pm.js";

export interface CreateOptions {
  blueprint?: string;
  packageManager?: PackageManager;
  dryRun: boolean;
  skipInstall: boolean;
  git: boolean;
  githubActions: boolean;
}

export function createProject(name: string | undefined, options: CreateOptions): void {
  if (!name) {
    fail("Project name is required. Example: genrex create my-project");
    return;
  }

  const config: ProjectConfig = {
    name: basename(name),
    destination: resolve(name),
    blueprint: options.blueprint ?? "ts-cli",
    packageManager: options.packageManager ?? "pnpm",
    testing: "vitest",
    formatter: "biome",
    git: options.git,
    githubActions: options.githubActions,
    docker: false,
  };
  const errors = validateConfig(config);
  const blueprint = getBlueprint(config.blueprint);

  if (!blueprint) {
    errors.push(`Blueprint '${config.blueprint}' not found`);
  }

  if (errors.length > 0 || !blueprint) {
    fail(`Invalid configuration:\n${errors.map((error) => `  - ${error}`).join("\n")}`);
    return;
  }

  if (config.blueprint !== "ts-cli") {
    fail(`Generation for blueprint '${config.blueprint}' is not implemented yet. Supported: ts-cli.`);
    return;
  }

  const files = buildTsCliFiles(config);

  if (options.git) {
    const gitStatus = checkGit();
    if (!gitStatus.available) {
      fail("Git was requested (--git), but 'git' is not installed or not in PATH.");
      return;
    }
  }

  if (options.dryRun) {
    console.log("DRY RUN\n");
    console.log(`Blueprint:       ${blueprint.name}`);
    console.log(`Destination:     ${config.destination}`);
    console.log(`Package manager: ${config.packageManager}`);
    console.log(`Git:             ${options.git ? "yes" : "no"}`);
    console.log(`GitHub Actions:  ${options.githubActions ? "yes" : "no"}`);
    console.log("\nWould create:");
    for (const f of files) {
      console.log(`  - ${f.path}`);
    }
    console.log("\nWould install:");
    console.log("  devDependencies: typescript, vitest, @biomejs/biome, @types/node");
    if (options.git) {
      console.log("\nWould execute:");
      console.log("  git init");
    }
    return;
  }

  try {
    prepareDestination(config.destination);
    writeProjectFiles(config.destination, files);
    console.log(`✓ Project scaffolded in ${config.destination}`);

    if (options.skipInstall) {
      console.log("○ Skipped dependency installation (--skip-install)");
    } else {
      console.log(`Installing dependencies using ${config.packageManager}...`);
      installDependencies(config.packageManager, config.destination);
      console.log("✓ Dependencies installed");
    }

    if (options.git) {
      console.log("Initializing Git repository...");
      initGit(config.destination);
      console.log("✓ Git repository initialized");
    }

    console.log("\nDone. Next steps:");
    console.log(`  cd ${name}`);
    if (options.skipInstall) {
      console.log(`  ${config.packageManager} install`);
    }
    console.log(`  ${config.packageManager} run build`);
    console.log(`  ${config.packageManager} test`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    fail(`Generation failed: ${message}`);
  }
}

function fail(message: string): void {
  console.error(`Error: ${message}`);
  process.exitCode = 1;
}

