import { strict as assert } from "node:assert";
import test from "node:test";
import { runDoctor } from "../src/doctor.js";

test("doctor runs without throwing error", () => {
  const originalLog = console.log;
  const originalExitCode = process.exitCode;
  let logged = false;
  console.log = () => {
    logged = true;
  };
  try {
    runDoctor();
    assert.equal(logged, true);
  } finally {
    console.log = originalLog;
    process.exitCode = originalExitCode;
  }
});
