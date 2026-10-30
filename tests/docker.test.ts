import { strict as assert } from "node:assert";
import test from "node:test";
import { generateDockerfile, generateDockerignore } from "../src/docker.js";
import type { ProjectConfig } from "../src/config.js";

const baseConfig: ProjectConfig = {
  name: "test-app",
  destination: "",
  blueprint: "ts-cli",
  packageManager: "npm",
  testing: "vitest",
  formatter: "biome",
  git: false,
  githubActions: false,
  docker: true,
};

test("generates multi-stage Dockerfile for ts-cli", () => {
  const content = generateDockerfile(baseConfig);
  assert.ok(content.includes("AS builder"));
  assert.ok(content.includes('"node", "dist/src/index.js"'));
});

test("generates Dockerfile with exposed port for node-api", () => {
  const content = generateDockerfile({ ...baseConfig, blueprint: "node-api" });
  assert.ok(content.includes("EXPOSE 3000"));
  assert.ok(content.includes('"node", "dist/src/server.js"'));
});

test("generates .dockerignore with key exclusions", () => {
  const content = generateDockerignore();
  assert.ok(content.includes("node_modules"));
  assert.ok(content.includes("dist"));
  assert.ok(content.includes(".git"));
});
