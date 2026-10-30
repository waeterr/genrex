import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { ProjectConfig } from "./config.js";
import { generateCiWorkflow } from "./ci.js";
import { generateDockerfile, generateDockerignore } from "./docker.js";

export interface GeneratedFile {
  path: string;
  content: string;
}

export function prepareDestination(destination: string): void {
  if (existsSync(destination)) {
    const files = readdirSync(destination);
    if (files.length > 0) {
      throw new Error(`Destination directory '${destination}' already exists and is not empty.`);
    }
    return;
  }
  mkdirSync(destination, { recursive: true });
}

export function buildTsCliFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [
    {
      path: "package.json",
      content: JSON.stringify(
        {
          name: config.name,
          version: "0.1.0",
          type: "module",
          bin: {
            [config.name]: "./dist/index.js",
          },
          scripts: {
            build: "tsc",
            dev: "tsc --watch",
            start: "node dist/index.js",
            test: "vitest run",
            format: "biome format --write .",
            lint: "biome check .",
          },
          devDependencies: {
            "@biomejs/biome": "^1.9.0",
            "@types/node": "^22.0.0",
            typescript: "^5.8.0",
            vitest: "^2.1.0",
          },
        },
        null,
        2,
      ) + "\n",
    },
    {
      path: "tsconfig.json",
      content: JSON.stringify(
        {
          compilerOptions: {
            target: "ES2022",
            module: "NodeNext",
            moduleResolution: "NodeNext",
            outDir: "dist",
            rootDir: "src",
            strict: true,
            skipLibCheck: true,
          },
          include: ["src/**/*"],
        },
        null,
        2,
      ) + "\n",
    },
    {
      path: "biome.json",
      content: JSON.stringify(
        {
          $schema: "https://biomejs.dev/schemas/1.9.4/schema.json",
          formatter: {
            enabled: true,
            indentStyle: "space",
            indentWidth: 2,
          },
          linter: {
            enabled: true,
            rules: {
              recommended: true,
            },
          },
        },
        null,
        2,
      ) + "\n",
    },
    {
      path: "README.md",
      content: `# ${config.name}

Generated with [genrex](https://github.com/waeterr/genrex).

## Scripts

- \`${config.packageManager} run build\` — Build with TypeScript
- \`${config.packageManager} run start\` — Run compiled output
- \`${config.packageManager} test\` — Run tests with Vitest
- \`${config.packageManager} run lint\` — Lint with Biome
`,
    },
    {
      path: ".gitignore",
      content: `node_modules/
dist/
coverage/
*.log
`,
    },
    {
      path: "src/index.ts",
      content: `#!/usr/bin/env node

export function main(): void {
  console.log("Hello from ${config.name}!");
}

main();
`,
    },
    {
      path: "tests/index.test.ts",
      content: `import { expect, test } from "vitest";

test("smoke test", () => {
  expect(1 + 1).toBe(2);
});
`,
    },
  ];

  if (config.githubActions) {
    files.push({
      path: ".github/workflows/ci.yml",
      content: generateCiWorkflow(config.packageManager),
    });
  }

  if (config.docker) {
    files.push(
      {
        path: "Dockerfile",
        content: generateDockerfile(config),
      },
      {
        path: ".dockerignore",
        content: generateDockerignore(),
      },
    );
  }

  return files;
}

export function writeProjectFiles(destination: string, files: GeneratedFile[]): void {
  for (const file of files) {
    const fullPath = join(destination, file.path);
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, file.content, "utf8");
  }
}
