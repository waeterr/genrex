import type { PackageManager } from "./config.js";

export function generateCiWorkflow(pm: PackageManager): string {
  const steps: string[] = [
    "      - uses: actions/checkout@v4",
  ];

  if (pm === "pnpm") {
    steps.push(
      "      - uses: pnpm/action-setup@v4\n        with:\n          version: 9",
      "      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: 'pnpm'",
      "      - run: pnpm install",
      "      - run: pnpm run lint",
      "      - run: pnpm test",
    );
  } else if (pm === "bun") {
    steps.push(
      "      - uses: oven-sh/setup-bun@v2",
      "      - run: bun install",
      "      - run: bun run lint",
      "      - run: bun test",
    );
  } else if (pm === "yarn") {
    steps.push(
      "      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: 'yarn'",
      "      - run: yarn install",
      "      - run: yarn run lint",
      "      - run: yarn test",
    );
  } else {
    steps.push(
      "      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: 'npm'",
      "      - run: npm install",
      "      - run: npm run lint",
      "      - run: npm test",
    );
  }

  return `name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
${steps.join("\n")}
`;
}
