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
import { installDependencies } from "./pm.js";

export interface CreateOptions {
  blueprint?: string;
  packageManager?: PackageManager;
  dryRun: boolean;
  skipInstall: boolean;
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
    git: false,
    githubActions: false,
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

  if (options.dryRun) {
    console.log("DRY RUN\n");
    console.log(`Blueprint:       ${blueprint.name}`);
    console.log(`Destination:     ${config.destination}`);
    console.log(`Package manager: ${config.packageManager}`);
    console.log("\nWould create:");
    for (const f of files) {
      console.log(`  - ${f.path}`);
    }
    console.log("\nWould install:");
    console.log("  devDependencies: typescript, vitest, @biomejs/biome, @types/node");
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

