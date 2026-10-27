import { strict as assert } from "node:assert";
import { existsSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { buildTsCliFiles, prepareDestination, writeProjectFiles } from "../src/generator.js";
import type { ProjectConfig } from "../src/config.js";

const config: ProjectConfig = {
  name: "example-cli",
  destination: "",
  blueprint: "ts-cli",
  packageManager: "pnpm",
  testing: "vitest",
  formatter: "biome",
  git: false,
  githubActions: false,
  docker: false,
};

test("builds TypeScript CLI project files", () => {
  const files = buildTsCliFiles(config);
  assert.ok(files.some((file) => file.path === "package.json"));
  assert.ok(files.some((file) => file.path === "src/index.ts"));
});

test("writes files into an empty destination", () => {
  const root = mkdtempSync(join(tmpdir(), "genrex-"));
  const destination = join(root, "app");
  try {
    prepareDestination(destination);
    writeProjectFiles(destination, buildTsCliFiles(config));
    assert.ok(existsSync(join(destination, "package.json")));
    assert.ok(existsSync(join(destination, "tests", "index.test.ts")));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("refuses non-empty destination", () => {
  const root = mkdtempSync(join(tmpdir(), "genrex-"));
  try {
    mkdirSync(join(root, "app"));
    assert.throws(() => prepareDestination(root), /already exists and is not empty/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
