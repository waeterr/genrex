import { strict as assert } from "node:assert";
import test from "node:test";
import { buildTsLibFiles } from "../src/generators/ts-lib.js";
import type { ProjectConfig } from "../src/config.js";

const config: ProjectConfig = {
  name: "my-ts-lib",
  destination: "",
  blueprint: "ts-lib",
  packageManager: "npm",
  testing: "vitest",
  formatter: "biome",
  git: false,
  githubActions: false,
  docker: false,
};

test("builds ts-lib files with declarations and exports", () => {
  const files = buildTsLibFiles(config);
  assert.ok(files.some((f) => f.path === "package.json"));
  assert.ok(files.some((f) => f.path === ".npmignore"));
  assert.ok(files.some((f) => f.path === "src/index.ts"));
  assert.ok(files.some((f) => f.path === "tests/index.test.ts"));

  const pkg = JSON.parse(files.find((f) => f.path === "package.json")!.content);
  assert.equal(pkg.main, "./dist/index.js");
  assert.equal(pkg.types, "./dist/index.d.ts");
  assert.ok(pkg.exports);

  const tsconfig = JSON.parse(files.find((f) => f.path === "tsconfig.json")!.content);
  assert.equal(tsconfig.compilerOptions.declaration, true);
});
