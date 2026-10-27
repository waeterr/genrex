import { execFileSync } from "node:child_process";
import type { PackageManager } from "./config.js";

export function installDependencies(pm: PackageManager, cwd: string): void {
  const isWindows = process.platform === "win32";
  const cmd = isWindows ? `${pm}.cmd` : pm;

  execFileSync(cmd, ["install"], {
    cwd,
    stdio: "inherit",
    shell: false,
  });
}
