import { spawnSync } from "node:child_process";
import { checkGit } from "./git.js";

interface ToolCheck {
  name: string;
  available: boolean;
  version?: string;
  optional: boolean;
}

export function runDoctor(): void {
  console.log("genrex Doctor\n");
  console.log("Environment\n" + "─".repeat(40) + "\n");

  const checks: ToolCheck[] = [
    checkTool("Node.js", "node", ["--version"], false),
    checkTool("npm", "npm", ["--version"], false),
    checkTool("pnpm", "pnpm", ["--version"], true),
    checkTool("yarn", "yarn", ["--version"], true),
    checkTool("bun", "bun", ["--version"], true),
    checkGitTool(),
  ];

  for (const check of checks) {
    const status = check.available ? "✓" : check.optional ? "○" : "✗";
    const label = check.name.padEnd(14);
    const version = check.version ? check.version : check.optional ? "not found (optional)" : "not found";
    console.log(`${status} ${label} ${version}`);
  }

  const critical = checks.filter((c) => !c.available && !c.optional);
  console.log();

  if (critical.length === 0) {
    console.log("Environment is ready.");
  } else {
    console.log("⚠ Missing required tools:");
    for (const c of critical) {
      console.log(`  - ${c.name}`);
    }
    process.exitCode = 1;
  }
}

function checkTool(
  name: string,
  command: string,
  args: string[],
  optional: boolean,
): ToolCheck {
  try {
    const isWindows = process.platform === "win32";
    // Node.js is always node.exe/node; npm/pnpm/yarn/bun are batch files (.cmd) on Windows
    const binary = isWindows && command !== "node" ? `${command}.cmd` : command;
    const result = spawnSync(binary, args, {
      encoding: "utf8",
      shell: isWindows,
      timeout: 5000,
    });

    if (result.status === 0 && result.stdout) {
      return { name, available: true, version: result.stdout.trim(), optional };
    }
    return { name, available: false, optional };
  } catch {
    return { name, available: false, optional };
  }
}

function checkGitTool(): ToolCheck {
  const git = checkGit();
  return {
    name: "Git",
    available: git.available,
    version: git.version,
    optional: true,
  };
}
