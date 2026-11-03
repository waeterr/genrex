import { strict as assert } from "node:assert";
import test from "node:test";
import { detectAvailablePackageManagers } from "../src/pm-detect.js";

test("detectAvailablePackageManagers returns at least one package manager", () => {
  const pms = detectAvailablePackageManagers();
  assert.ok(Array.isArray(pms));
  assert.ok(pms.length >= 1);
  assert.ok(pms.includes("npm") || pms.includes("pnpm") || pms.includes("yarn") || pms.includes("bun"));
});
