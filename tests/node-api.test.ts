import { strict as assert } from "node:assert";
import test from "node:test";
import { buildNodeApiFiles } from "../src/generators/node-api.js";
import type { ProjectConfig } from "../src/config.js";

const config: ProjectConfig = {
  name: "my-fastify-api",
  destination: "",
  blueprint: "node-api",
  packageManager: "pnpm",
  testing: "vitest",
  formatter: "biome",
  git: false,
  githubActions: true,
  docker: false,
};

test("builds node-api project files correctly", () => {
  const files = buildNodeApiFiles(config);
  assert.ok(files.some((f) => f.path === "package.json"));
  assert.ok(files.some((f) => f.path === "src/server.ts"));
  assert.ok(files.some((f) => f.path === ".github/workflows/ci.yml"));

  const pkgFile = files.find((f) => f.path === "package.json");
  const pkgJson = JSON.parse(pkgFile!.content);
  assert.equal(pkgJson.dependencies?.fastify, "^5.1.0");
  assert.equal(pkgJson.devDependencies?.tsx, "^4.19.0");
});
