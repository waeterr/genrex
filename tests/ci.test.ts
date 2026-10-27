import { strict as assert } from "node:assert";
import test from "node:test";
import { generateCiWorkflow } from "../src/ci.js";

test("generates CI workflow with pnpm actions", () => {
  const yaml = generateCiWorkflow("pnpm");
  assert.ok(yaml.includes("pnpm/action-setup"));
  assert.ok(yaml.includes("pnpm install"));
  assert.ok(yaml.includes("pnpm test"));
});

test("generates CI workflow with npm actions", () => {
  const yaml = generateCiWorkflow("npm");
  assert.ok(yaml.includes("npm install"));
  assert.ok(yaml.includes("npm test"));
});

test("generates CI workflow with bun actions", () => {
  const yaml = generateCiWorkflow("bun");
  assert.ok(yaml.includes("oven-sh/setup-bun"));
  assert.ok(yaml.includes("bun install"));
});
