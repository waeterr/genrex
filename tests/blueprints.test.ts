import { strict as assert } from "node:assert";
import test from "node:test";
import { blueprints, getBlueprint } from "../src/blueprints.js";

test("blueprint registry has default blueprints", () => {
  assert.ok(blueprints.length >= 3);
});

test("can get blueprint by id", () => {
  const bp = getBlueprint("ts-cli");
  assert.equal(bp?.id, "ts-cli");
  assert.equal(bp?.language, "TypeScript");
});

test("returns undefined for unknown blueprint", () => {
  assert.equal(getBlueprint("unknown"), undefined);
});
