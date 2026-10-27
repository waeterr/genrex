import { strict as assert } from "node:assert";
import test from "node:test";
import { checkGit } from "../src/git.js";

test("checks Git availability without throwing", () => {
  const result = checkGit();
  assert.equal(typeof result.available, "boolean");
  if (result.available) {
    assert.match(result.version ?? "", /^git version /);
  }
});
