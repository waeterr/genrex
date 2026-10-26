import { strict as assert } from "node:assert";
import test from "node:test";
import { validateConfig, validateProjectName } from "../src/config.js";

test("validates valid project names", () => {
  assert.equal(validateProjectName("my-cli"), null);
  assert.equal(validateProjectName("@scope/pkg"), null);
  assert.equal(validateProjectName("app-123"), null);
});

test("rejects invalid project names", () => {
  assert.notEqual(validateProjectName(""), null);
  assert.notEqual(validateProjectName("MyProject"), null);
  assert.notEqual(validateProjectName("-invalid"), null);
});

test("validates project configuration", () => {
  const validErrors = validateConfig({
    name: "my-app",
    destination: "C:\\tmp\\my-app",
    blueprint: "ts-cli",
    packageManager: "pnpm",
    testing: "vitest",
    formatter: "biome",
    git: false,
    githubActions: false,
    docker: false,
  });
  assert.equal(validErrors.length, 0);

  const invalidErrors = validateConfig({
    name: "Invalid Name",
    destination: "C:\\tmp\\bad",
    blueprint: "",
    packageManager: "pnpm",
    testing: "vitest",
    formatter: "biome",
    git: false,
    githubActions: false,
    docker: false,
  });
  assert.equal(invalidErrors.length, 2);
});
