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
  type GeneratedFile,
} from "./generator.js";
import { buildNodeApiFiles } from "./generators/node-api.js";
import { buildTsLibFiles } from "./generators/ts-lib.js";
import { checkGit, initGit } from "./git.js";
import { installDependencies } from "./pm.js";
import { promptWizard } from "./prompt.js";

export interface CreateOptions {
  blueprint?: string;
  packageManager?: PackageManager;
  dryRun: boolean;
  skipInstall: boolean;
  git: boolean;
  githubActions: boolean;
  docker: boolean;
  interactive?: boolean;
}

export async function createProject(name: string | undefined, options: CreateOptions): Promise<void> {
  let targetName = name;
  let targetBlueprint = options.blueprint ?? "ts-cli";
  let targetPm = options.packageManager ?? "pnpm";
  let targetGit = options.git;
  let targetCi = options.githubActions;
  let targetDocker = options.docker;

  const shouldPrompt =
    Boolean(process.stdin.isTTY) &&
    (!targetName || options.interactive || (!options.blueprint && !options.dryRun));

  if (shouldPrompt) {
    const answers = await promptWizard(targetName);
    targetName = answers.name;
    targetBlueprint = answers.blueprint;
    targetPm = answers.packageManager;
    targetGit = answers.git;
    targetCi = answers.githubActions;
    targetDocker = answers.docker;
  }

  if (!targetName) {
    fail("Project name is required. Example: genrex create my-project");
    return;
  }

  const config: ProjectConfig = {
    name: basename(targetName),
    destination: resolve(targetName),
    blueprint: targetBlueprint,
    packageManager: targetPm,
    testing: "vitest",
    formatter: "biome",
    git: targetGit,
    githubActions: targetCi,
    docker: targetDocker,
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

  let files: GeneratedFile[];
  if (config.blueprint === "ts-cli") {
    files = buildTsCliFiles(config);
  } else if (config.blueprint === "node-api") {
    files = buildNodeApiFiles(config);
  } else if (config.blueprint === "ts-lib") {
    files = buildTsLibFiles(config);
  } else {
    fail(`Generation for blueprint '${config.blueprint}' is not implemented yet. Supported: ts-cli, node-api, ts-lib.`);
    return;
  }

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
    console.log(`Git:             ${config.git ? "yes" : "no"}`);
    console.log(`GitHub Actions:  ${config.githubActions ? "yes" : "no"}`);
    console.log(`Docker:          ${config.docker ? "yes" : "no"}`);
    console.log("\nWould create:");
    for (const f of files) {
      console.log(`  - ${f.path}`);
    }
    console.log("\nWould install:");
    console.log("  devDependencies: typescript, vitest, @biomejs/biome, @types/node");
    if (config.git) {
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

    if (config.git) {
      console.log("Initializing Git repository...");
      initGit(config.destination);
      console.log("✓ Git repository initialized");
    }

    console.log("\nDone. Next steps:");
    console.log(`  cd ${targetName}`);
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

