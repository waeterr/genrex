import { spawnSync } from "node:child_process";
import type { PackageManager } from "./config.js";

export function detectAvailablePackageManagers(): PackageManager[] {
  const managers: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];
  const available: PackageManager[] = [];
  const isWindows = process.platform === "win32";

  for (const pm of managers) {
    const cmd = isWindows ? `${pm}.cmd` : pm;
    try {
      const result = spawnSync(cmd, ["--version"], {
        encoding: "utf8",
        shell: isWindows,
        timeout: 3000,
      });
      if (result.status === 0) {
        available.push(pm);
      }
    } catch {
      // PM not available
    }
  }

  return available.length > 0 ? available : ["npm"];
}
