import { basename, resolve } from "node:path";
import { getBlueprint } from "./blueprints.js";
import {
  type PackageManager,
  type ProjectConfig,
  validateConfig,
} from "./config.js";

export interface CreateOptions {
  blueprint?: string;
  packageManager?: PackageManager;
  dryRun: boolean;
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

  if (!options.dryRun) {
    fail("Project generation is not available yet. Use --dry-run to preview.");
    return;
  }

  console.log("DRY RUN\n");
  console.log(`Blueprint:       ${blueprint.name}`);
  console.log(`Destination:     ${config.destination}`);
  console.log(`Package manager: ${config.packageManager}`);
  console.log("\nWould create:");
  console.log(`  ${config.name}/`);
  console.log("  ├── src/index.ts");
  console.log("  ├── tests/index.test.ts");
  console.log("  ├── package.json");
  console.log("  ├── tsconfig.json");
  console.log("  ├── biome.json");
  console.log("  ├── README.md");
  console.log("  └── .gitignore");
  console.log("\nWould install:");
  console.log("  devDependencies: typescript, vitest, @biomejs/biome");
}

function fail(message: string): void {
  console.error(`Error: ${message}`);
  process.exitCode = 1;
}
