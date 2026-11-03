import { strict as assert } from "node:assert";
import { PassThrough } from "node:stream";
import test from "node:test";
import { blueprints } from "../src/blueprints.js";
import { promptWizard } from "../src/prompt.js";

test("blueprints list contains choices for prompt wizard", () => {
  assert.ok(blueprints.length >= 3);
  assert.equal(blueprints[0].id, "ts-cli");
  assert.equal(blueprints[1].id, "node-api");
  assert.equal(blueprints[2].id, "ts-lib");
});

test("promptWizard collects answers correctly", async () => {
  const input = new PassThrough();
  const output = new PassThrough();

  const promise = promptWizard("test-proj", input, output);

  output.on("data", (chunk: Buffer) => {
    const text = chunk.toString();
    if (text.includes("Select [1-3]")) {
      input.write("1\n");
    } else if (text.includes("Select [1-4]")) {
      input.write("2\n");
    } else if (text.includes("Initialize Git?")) {
      input.write("y\n");
    } else if (text.includes("GitHub Actions CI?")) {
      input.write("n\n");
    } else if (text.includes("Add Docker?")) {
      input.write("n\n");
    }
  });

  const result = await promise;
  assert.equal(result.name, "test-proj");
  assert.equal(result.blueprint, "ts-cli");
  // Package manager depends on system availability, just verify it's valid
  assert.ok(["npm", "pnpm", "yarn", "bun"].includes(result.packageManager));
  assert.equal(result.git, true);
  assert.equal(result.githubActions, false);
  assert.equal(result.docker, false);
});

