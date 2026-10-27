import { execFileSync, spawnSync } from "node:child_process";

export interface GitCheckResult {
  available: boolean;
  version?: string;
}

export function checkGit(): GitCheckResult {
  try {
    const result = spawnSync("git", ["--version"], {
      encoding: "utf8",
      shell: false,
    });
    if (result.status === 0 && result.stdout) {
      return { available: true, version: result.stdout.trim() };
    }
    return { available: false };
  } catch {
    return { available: false };
  }
}

export function initGit(cwd: string): void {
  execFileSync("git", ["init"], {
    cwd,
    stdio: "inherit",
    shell: false,
  });
}
