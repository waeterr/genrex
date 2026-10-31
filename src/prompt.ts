import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { blueprints } from "./blueprints.js";
import type { PackageManager } from "./config.js";

export interface WizardResult {
  name: string;
  blueprint: string;
  packageManager: PackageManager;
  git: boolean;
  githubActions: boolean;
  docker: boolean;
}

export async function promptWizard(initialName?: string): Promise<WizardResult> {
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    console.log("\ngenrex — Project Blueprint Engine\n");

    let name = initialName;
    if (name) {
      console.log(`? Project name: ${name}`);
    } else {
      while (!name || name.trim() === "") {
        const answer = await rl.question("? Project name: ");
        name = answer.trim();
        if (!name) {
          console.log("  Project name cannot be empty.");
        }
      }
    }

    console.log("\n? Choose a blueprint:");
    blueprints.forEach((b, i) => {
      console.log(`  ${i + 1}) ${b.name.padEnd(22)} (${b.id})`);
    });
    const bpChoice = await rl.question(`Select [1-${blueprints.length}] (1): `);
    const bpIndex = Number.parseInt(bpChoice.trim() || "1", 10) - 1;
    const blueprint = (blueprints[bpIndex] ?? blueprints[0]).id;

    const pms: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];
    console.log("\n? Package manager:");
    pms.forEach((pm, i) => {
      console.log(`  ${i + 1}) ${pm}`);
    });
    const pmChoice = await rl.question(`Select [1-${pms.length}] (1): `);
    const pmIndex = Number.parseInt(pmChoice.trim() || "1", 10) - 1;
    const packageManager = pms[pmIndex] ?? "pnpm";

    const gitAns = await rl.question("\n? Initialize Git? (Y/n): ");
    const git = gitAns.trim().toLowerCase() !== "n";

    const ciAns = await rl.question("? Add GitHub Actions CI? (y/N): ");
    const githubActions = ciAns.trim().toLowerCase() === "y";

    const dockerAns = await rl.question("? Add Docker? (y/N): ");
    const docker = dockerAns.trim().toLowerCase() === "y";

    console.log();
    return {
      name,
      blueprint,
      packageManager,
      git,
      githubActions,
      docker,
    };
  } finally {
    rl.close();
  }
}
