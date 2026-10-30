import { strict as assert } from "node:assert";
import test from "node:test";
import { blueprints } from "../src/blueprints.js";

test("blueprints list contains choices for prompt wizard", () => {
  assert.ok(blueprints.length >= 3);
  assert.equal(blueprints[0].id, "ts-cli");
  assert.equal(blueprints[1].id, "node-api");
  assert.equal(blueprints[2].id, "ts-lib");
});
